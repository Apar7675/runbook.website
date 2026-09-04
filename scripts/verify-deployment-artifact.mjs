import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function normalize(path) {
  return path.replaceAll("\\", "/");
}

function repositoryPath(path) {
  return normalize(relative(repositoryRoot, path));
}

function runGit(args) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function listFiles(root) {
  const files = [];
  const pending = [root];

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;

    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = resolve(current, entry.name);
      if (entry.isSymbolicLink()) {
        errors.push(`${repositoryPath(fullPath)}: symbolic links are not allowed in the deployment artifact`);
      } else if (entry.isDirectory()) {
        pending.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function isForbiddenTrackedPath(relativePath) {
  const path = normalize(relativePath);
  const segments = path.split("/");
  const baseName = segments.at(-1) ?? "";

  if (/^\.env(?:\.|$)/u.test(baseName) && path !== ".env.example") return true;

  return (
    segments.some((segment) =>
      [".next", ".vercel", "build", "coverage", "node_modules", "out"].includes(segment),
    ) ||
    /\.(db|log|sqlite|sqlite3|p8|p12|pem|pfx|key)$/iu.test(baseName)
  );
}

function verifyTrackedContext() {
  let trackedPaths = [];
  try {
    trackedPaths = runGit(["ls-files", "-z"])
      .split("\0")
      .filter(Boolean)
      .map(normalize);
  } catch {
    errors.push("Unable to enumerate the Git index.");
    return [];
  }

  for (const path of trackedPaths) {
    if (isForbiddenTrackedPath(path)) {
      errors.push(`${path}: generated, local-environment, log, database, or key material is tracked`);
    }
  }

  const ignoredPaths = [
    ".env.local",
    ".env.production.local",
    ".next/cache/example",
    ".next/dev/example",
    ".vercel/project.json",
    "build/example",
    "coverage/example",
    "out/example",
  ];
  for (const path of ignoredPaths) {
    try {
      execFileSync("git", ["check-ignore", "--no-index", "--quiet", "--", path], {
        cwd: repositoryRoot,
        stdio: "ignore",
      });
    } catch {
      errors.push(`${path}: must be excluded by .gitignore`);
    }
  }

  return trackedPaths;
}

function parseEnvironmentFile(path) {
  const entries = new Map();
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^(?:"(.*)"|'(.*)')$/u, "$1$2");
    entries.set(key, value);
  }
  return entries;
}

function verifyEnvironmentExample() {
  const path = resolve(repositoryRoot, ".env.example");
  if (!existsSync(path)) {
    errors.push(".env.example: required synthetic configuration is missing");
    return;
  }

  const entries = parseEnvironmentFile(path);
  const exactKeys = [
    "RESEND_API_KEY",
    "RUNBOOK_LEADS_TO_EMAIL",
    "RUNBOOK_LEADS_FROM_EMAIL",
  ];

  for (const key of exactKeys) {
    if (!entries.has(key)) errors.push(`.env.example: required key ${key} is missing`);
  }
  for (const key of entries.keys()) {
    if (!exactKeys.includes(key)) errors.push(`.env.example: unexpected key ${key}`);
  }

  if (entries.get("RESEND_API_KEY")) {
    errors.push(".env.example: RESEND_API_KEY must be blank");
  }

  for (const key of ["RUNBOOK_LEADS_TO_EMAIL", "RUNBOOK_LEADS_FROM_EMAIL"]) {
    const value = entries.get(key) ?? "";
    if (!/@example\.invalid\b/iu.test(value)) {
      errors.push(`.env.example: ${key} must use the reserved synthetic domain`);
    }
  }
}

function verifyLoggingBoundary() {
  const path = resolve(repositoryRoot, "app/api/request-demo/route.ts");
  const source = readFileSync(path, "utf8");
  const consoleCalls = source.matchAll(/console\.(?:log|info|warn|error)\s*\(([\s\S]*?)\);/gu);
  const sensitiveArgument = /\b(?:lead|body|firstName|lastName|company|email|phone|message)\b|\.text\s*\(/u;

  for (const call of consoleCalls) {
    if (sensitiveArgument.test(call[1] ?? "")) {
      errors.push("app/api/request-demo/route.ts: console output includes lead data or a provider response body");
    }
  }

  if (!source.includes("requestId") || !source.includes("crypto.randomUUID()")) {
    errors.push("app/api/request-demo/route.ts: non-PII correlation logging is missing");
  }
}

const secretPatterns = [
  ["JWT-shaped credential", /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/u],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u],
  ["provider secret", /\b(?:(?:sk_live_|sk_test_|sb_secret_)[A-Za-z0-9_-]{12,}|re_[A-Za-z0-9]{20,})/u],
  ["credential-bearing database URL", /postgres(?:ql)?:\/\/[^\s/:@]+:[^\s/@]+@/iu],
  ["Social Security number-shaped value", /\b\d{3}-\d{2}-\d{4}\b/u],
];
const emailPattern = /\b[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})\b/giu;
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
]);

function scanText(path, label, { checkGenericPii = true, knownLocalValues = [] } = {}) {
  if (!textExtensions.has(extname(path).toLowerCase())) return;

  const bytes = readFileSync(path);
  if (bytes.includes(0)) return;
  const text = bytes.toString("utf8");

  for (const [kind, pattern] of secretPatterns) {
    if (pattern.test(text)) errors.push(`${label}: contains a literal ${kind}`);
  }

  for (const value of knownLocalValues) {
    if (value && text.includes(value)) {
      errors.push(`${label}: contains a value from a local environment file`);
    }
  }

  if (!checkGenericPii) return;
  for (const match of text.matchAll(emailPattern)) {
    const domain = (match[1] ?? "").toLowerCase();
    if (domain !== "example.invalid") {
      errors.push(`${label}: contains a non-synthetic email-shaped literal`);
      break;
    }
  }
}

function collectKnownLocalValues() {
  const values = new Set();
  const candidates = [
    ".env",
    ".env.local",
    ".env.production",
    ".env.production.local",
  ];

  for (const relativePath of candidates) {
    const path = resolve(repositoryRoot, relativePath);
    if (!existsSync(path)) continue;

    for (const value of parseEnvironmentFile(path).values()) {
      if (value.length >= 6 && !/(example|placeholder|changeme)/iu.test(value)) values.add(value);
    }
  }

  return [...values];
}

function verifyTrackedText(trackedPaths) {
  const verifierPath = "scripts/verify-deployment-artifact.mjs";
  for (const relativePath of trackedPaths) {
    if (relativePath === verifierPath) continue;
    const path = resolve(repositoryRoot, relativePath);
    if (!existsSync(path) || lstatSync(path).isSymbolicLink()) continue;
    scanText(path, relativePath);
  }
}

function isForbiddenArtifactPath(relativePath) {
  const path = normalize(relativePath);
  const segments = path.split("/");
  const baseName = segments.at(-1) ?? "";
  const inThirdPartyDependencies = segments.includes("node_modules");

  if (/^\.env(?:\.|$)/u.test(baseName)) return true;
  if (/\.(db|log|sqlite|sqlite3|p8|p12|pem|pfx|key)$/iu.test(baseName)) return true;
  if ([".git", ".github", ".vercel", "coverage"].some((part) => segments.includes(part))) {
    return true;
  }
  if (!inThirdPartyDependencies && ["cache", "dev"].some((part) => segments.includes(part))) return true;
  if ([".gitignore", ".gitattributes", "AGENTS.md", "CLAUDE.md"].includes(baseName)) return true;
  if (!inThirdPartyDependencies && /\.(ts|tsx)$/iu.test(baseName)) return true;

  return false;
}

function verifyDeploymentArtifact() {
  const standaloneRoot = resolve(repositoryRoot, ".next/standalone");
  const staticRoot = resolve(repositoryRoot, ".next/static");
  const publicRoot = resolve(repositoryRoot, "public");
  const required = [
    [standaloneRoot, ".next/standalone"],
    [staticRoot, ".next/static"],
    [publicRoot, "public"],
  ];

  for (const [path, label] of required) {
    if (!existsSync(path)) errors.push(`${label}: required documented Next deployment root is missing`);
  }
  if (!existsSync(resolve(standaloneRoot, "server.js"))) {
    errors.push(".next/standalone/server.js: required standalone server is missing");
  }
  if (errors.some((error) => error.includes("required documented Next deployment root is missing"))) return 0;

  const knownLocalValues = collectKnownLocalValues();
  const roots = [standaloneRoot, staticRoot, publicRoot];
  let fileCount = 0;

  for (const root of roots) {
    for (const path of listFiles(root)) {
      fileCount += 1;
      const label = repositoryPath(path);
      if (isForbiddenArtifactPath(label)) {
        errors.push(`${label}: forbidden development, cache, log, environment, database, source, or key residue`);
        continue;
      }

      scanText(path, label, {
        checkGenericPii: !label.includes("/node_modules/"),
        knownLocalValues,
      });
    }
  }

  return fileCount;
}

const trackedPaths = verifyTrackedContext();
verifyEnvironmentExample();
verifyLoggingBoundary();
verifyTrackedText(trackedPaths);
const artifactFileCount = verifyDeploymentArtifact();

if (errors.length > 0) {
  console.error("Deployment verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Deployment verification passed (${trackedPaths.length} tracked paths and ${artifactFileCount} deployable files checked).`,
  );
}
