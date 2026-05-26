"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const benefits = [
  ["WO", "Work order and routing control", "See how released routings, travelers, and packet files move from office planning to the floor."],
  ["BI", "Ballooned drawings and inspection", "Walk through balloon packets, inspection templates, and first article, in-process, and final results."],
  ["TC", "Employee time and workstation visibility", "Review how operators clock to jobs and operations while supervisors control exceptions."],
];

const shopTypes = [
  "CNC Job Shop",
  "Swiss Machining",
  "Production Machining",
  "Fabrication",
  "Inspection / Quality",
  "Other",
];

const interests = [
  "Full RunBook Platform",
  "Routing DB",
  "Work Orders",
  "Workstation",
  "Ballooned Drawings / Inspection",
  "Employee Time Control",
  "Mobile Capture",
];

const footerGroups: Array<[string, string[]]> = [
  ["Product", ["Routing DB", "Work Orders", "Workstation", "Inspection"]],
  ["Workflow", ["PO Intake", "Time Control", "Mobile Capture", "Shipping"]],
  ["Company", ["About", "Careers", "Security", "Status"]],
  ["Contact", ["Request Demo", "Contact Us", "Support", "Sales"]],
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusDot({ color = "bg-[#24C47E]" }: { color?: string }) {
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

export default function RequestDemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      shopType: String(formData.get("shopType") || ""),
      mainInterest: String(formData.get("mainInterest") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/request-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        devMode?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus({
          type: "error",
          message: result.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: result.devMode
          ? "Demo request captured locally for development."
          : "Thanks — your demo request was received. We’ll reach out soon.",
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message: "Unable to submit right now. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070C] text-[#F4F7FB]">
      <div className="site-grid pointer-events-none fixed inset-0 opacity-40" />
      <div className="page-aurora pointer-events-none fixed inset-0" />

      <header className="relative z-10 border-b border-[#263244]/70 bg-[#05070C]/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="brand-logo-link" aria-label="RunBook home">
            <Image
              src="/brand/runbook-logo.png"
              alt="RunBook"
              width={230}
              height={42}
              className="brand-logo"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#9CA8BA] lg:flex">
            <Link href="/#product" className="transition hover:text-white">Product</Link>
            <Link href="/#workflow" className="transition hover:text-white">Workflow</Link>
            <Link href="/#inspection" className="transition hover:text-white">Inspection</Link>
            <Link href="/#time-control" className="transition hover:text-white">Time Control</Link>
            <Link href="/request-demo" className="text-white">Request Demo</Link>
          </nav>
          <Link href="/request-demo" className="btn-primary hidden sm:inline-flex">Request Demo</Link>
        </div>
      </header>

      <section className="demo-section relative z-10 mx-auto grid max-w-[90rem] gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#263244] bg-[#0B111C]/85 px-3 py-1.5 text-xs font-semibold uppercase text-[#62D6FF]">
            <StatusDot />
            Request demo
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4rem]">
            See how RunBook can control your shop floor.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#B8C2D2]">
            Tell us about your shop, your workflow, and what you want to improve. We will use that to walk through the right parts of RunBook.
          </p>

          <div className="mt-8 grid gap-4">
            {benefits.map(([badge, title, copy]) => (
              <article key={title} className="demo-benefit-card">
                <span className="feature-badge">{badge}</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">{title}</h2>
                  <p className="mt-2 leading-7 text-[#9CA8BA]">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="demo-form-card">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#263244] pb-5">
            <div>
              <p className="text-xs font-bold uppercase text-[#62D6FF]">Shop workflow review</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Request a RunBook demo</h2>
            </div>
            <div className="hidden rounded-full border border-[#24C47E]/30 bg-[#24C47E]/10 px-3 py-1 text-xs font-bold text-[#24C47E] sm:inline-flex">
              Guided setup available
            </div>
          </div>

          {status ? (
            <div className={status.type === "success" ? "demo-success" : "demo-error"} aria-live="polite">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#24C47E]/35 bg-[#24C47E]/12 text-[#24C47E]">
                <StatusDot />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {status.type === "success" ? "Demo request received." : "Demo request not sent."}
                </h3>
                <p className="mt-2 leading-7 text-[#B8C2D2]">{status.message}</p>
              </div>
            </div>
          ) : null}

          <form className="demo-form-grid" onSubmit={handleSubmit}>
            <div className="form-two-col">
              <label className="form-field">
                <span>First name</span>
                <input name="firstName" type="text" autoComplete="given-name" required />
              </label>
              <label className="form-field">
                <span>Last name</span>
                <input name="lastName" type="text" autoComplete="family-name" required />
              </label>
            </div>

            <div className="form-two-col">
              <label className="form-field">
                <span>Company</span>
                <input name="company" type="text" autoComplete="organization" required />
              </label>
              <label className="form-field">
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>

            <div className="form-two-col">
              <label className="form-field">
                <span>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
              <label className="form-field">
                <span>Shop type</span>
                <select name="shopType" defaultValue="" required>
                  <option value="" disabled>Select shop type</option>
                  {shopTypes.map((shopType) => (
                    <option key={shopType}>{shopType}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="form-field">
              <span>Main interest</span>
              <select name="mainInterest" defaultValue="" required>
                <option value="" disabled>Select main interest</option>
                {interests.map((interest) => (
                  <option key={interest}>{interest}</option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Message</span>
              <textarea name="message" rows={5} placeholder="Tell us what is hard to control today: routings, travelers, inspection, time, workstation execution, or mobile evidence." />
            </label>

            <button type="submit" className="btn-primary demo-submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Request..." : "Request Demo"}
              {!isSubmitting ? <ArrowIcon /> : null}
            </button>
          </form>
        </div>
      </section>

      <footer className="footer-shell relative z-10 border-t border-[#263244] bg-[#05070C]">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1.35fr_repeat(4,1fr)] lg:px-8">
          <div>
            <Link href="/" className="brand-logo-link" aria-label="RunBook home">
              <Image
                src="/brand/runbook-logo.png"
                alt="RunBook"
                width={200}
                height={38}
                className="brand-logo brand-logo-footer"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#9CA8BA]">
              Manufacturing workflow control for routing, work orders, workstation execution, inspection, time, and mobile evidence.
            </p>
            <p className="mt-6 text-xs text-[#667085]">Copyright 2026 RunBook. All rights reserved.</p>
          </div>
          {footerGroups.map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-white">{title}</p>
              <div className="mt-3 grid gap-2 text-sm text-[#9CA8BA]">
                {links.map((link) => (
                  <a key={link} href={link === "Request Demo" ? "/request-demo" : "/#product"} className="hover:text-white">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
