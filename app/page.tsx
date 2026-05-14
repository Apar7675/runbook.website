const navItems = ["Product", "Workflow", "Inspection", "Time Control"];

const workflow = [
  "PO Intake",
  "Routing DB",
  "Work Orders",
  "Workstation",
  "Ballooned Inspection",
  "Time Control",
  "Shipping",
];

const workOrders = [
  ["WO-4827", "Aerospace bracket", "OP30", "Inspect"],
  ["WO-4822", "Swiss pin lot", "OP20", "Running"],
  ["WO-4819", "Valve body", "OP20", "Break"],
  ["WO-4808", "Turned shaft", "OP10", "Ready"],
];

const features = [
  {
    badge: "RT",
    title: "Routing DB",
    copy: "Control repeatable manufacturing steps before jobs reach the floor.",
    bullets: ["Operations", "Setup notes", "Release control"],
  },
  {
    badge: "WO",
    title: "Work Orders",
    copy: "Build traveler packets with routing, drawings, instructions, and live status.",
    bullets: ["Travelers", "Packet files", "Shop status"],
  },
  {
    badge: "WS",
    title: "Workstation",
    copy: "Give operators the exact operation context they need at the machine.",
    bullets: ["Active OP", "Files", "Signoffs"],
  },
  {
    badge: "QR",
    title: "Mobile Capture",
    copy: "Capture evidence, photos, notes, and QR events from the floor.",
    bullets: ["Photos", "QR scans", "Evidence"],
  },
  {
    badge: "BI",
    title: "Ballooned Drawings",
    copy: "Connect balloon numbers to inspection templates and job packets.",
    bullets: ["Balloons", "Templates", "Results"],
  },
  {
    badge: "TC",
    title: "Employee Time Control",
    copy: "Tie labor to work orders and operations with supervisor review.",
    bullets: ["Clock events", "Exceptions", "Payroll review"],
  },
];

const inspectionRows = [
  ["1", "Bore ID", "0.7500", "+/- .0005", "0.7502", "Pass"],
  ["2", "True position", "0.002", "+/- .001", "0.0027", "Review"],
  ["3", "Face flatness", "0.001", "Max", "0.0008", "Pass"],
  ["4", "Slot width", "0.3125", "+/- .001", "0.3151", "Fail"],
];

const timeRows = [
  ["John Smith", "Clocked In", "WO-4827 OP30", "6.25 hrs", "green"],
  ["Alex Martin", "On Break", "WO-4819 OP20", "4.10 hrs", "amber"],
  ["Mike Rivera", "Needs Review", "Operation mismatch", "2.75 hrs", "red"],
  ["Chris Taylor", "Clocked Out", "WO-4808 OP10", "8.00 hrs", "gray"],
];

const exceptionRows = [
  ["Operation mismatch", "Mike Rivera", "Review", "amber"],
  ["Missing QR evidence", "OP30 Inspection", "Hold", "red"],
  ["Late clock out", "Alex Martin", "Review", "amber"],
];

const comparisons = [
  ["Full ERP", "Powerful but heavy", "gray"],
  ["Task board", "Simple but disconnected", "amber"],
  ["RunBook", "Controlled manufacturing execution", "blue"],
];

const ctaPanels = [
  ["Request Demo", "Walk through real shop-floor controls", "blue"],
  ["Shop Workflow Review", "Map routing to workstation execution", "green"],
  ["Workstation + Inspection Preview", "See packets, balloons, time, and evidence", "purple"],
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

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#24C47E]" viewBox="0 0 20 20" fill="none">
      <path d="m4.5 10.5 3.2 3.2 7.8-8.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusDot({ color = "bg-[#24C47E]" }: { color?: string }) {
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

function Chip({ children, tone }: { children: React.ReactNode; tone: "green" | "amber" | "red" | "blue" | "gray" }) {
  const tones = {
    green: "border-[#24C47E]/35 bg-[#24C47E]/12 text-[#24C47E]",
    amber: "border-[#F5A524]/35 bg-[#F5A524]/12 text-[#F5A524]",
    red: "border-[#EF4444]/35 bg-[#EF4444]/12 text-[#F87171]",
    blue: "border-[#62D6FF]/35 bg-[#62D6FF]/12 text-[#62D6FF]",
    gray: "border-[#9CA8BA]/25 bg-[#9CA8BA]/10 text-[#B8C2D2]",
  };

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070C] text-[#F4F7FB]">
      <div className="site-grid pointer-events-none fixed inset-0 opacity-40" />
      <div className="page-aurora pointer-events-none fixed inset-0" />

      <header className="relative z-10 border-b border-[#263244]/70 bg-[#05070C]/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="RunBook home">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#3F8CFF]/45 bg-[#111A2A] text-sm font-black text-[#62D6FF] shadow-[0_0_34px_rgba(63,140,255,0.28)]">RB</span>
            <span className="text-lg font-semibold text-white">RunBook</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#9CA8BA] lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-white">
                {item}
              </a>
            ))}
            <a href="/request-demo" className="transition hover:text-white">Request Demo</a>
          </nav>
          <a href="/request-demo" className="btn-primary hidden sm:inline-flex">Request Demo</a>
        </div>
      </header>

      <section id="product" className="hero-section relative z-10 mx-auto grid max-w-[90rem] gap-10 px-5 pb-10 pt-11 sm:px-6 sm:pt-14 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:pb-14 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#263244] bg-[#0B111C]/85 px-3 py-1.5 text-xs font-semibold uppercase text-[#62D6FF]">
            <StatusDot />
            Manufacturing workflow control
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4rem]">
            The missing link between office planning and shop-floor execution.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#B8C2D2]">
            RunBook connects routing, work orders, travelers, ballooned inspection, employee time, and workstation execution into one controlled manufacturing workflow.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="/request-demo" className="btn-primary">Request Demo <ArrowIcon /></a>
            <a href="#trial-preview" className="btn-secondary">30-Day Trial Coming Soon</a>
            <a href="#workflow" className="btn-secondary">View Workflow</a>
          </div>
          <p className="mt-4 text-sm font-medium text-[#9CA8BA]">
            Self-install trial coming soon. Guided demos available now.
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            {["Routing", "Inspection", "Labor"].map((label, index) => (
              <div key={label} className="rounded-lg border border-[#263244] bg-[#0B111C]/70 p-3">
                <p className="text-2xl font-semibold text-white">{["1", "8", "4"][index]}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-[#9CA8BA]">{label} controls</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-shell">
            <div className="flex items-center justify-between border-b border-[#263244] px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#62D6FF]">Production command</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Shop Floor Live</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#24C47E]/30 bg-[#24C47E]/10 px-3 py-1 text-xs font-bold text-[#24C47E]">
                <StatusDot />
                Synced
              </div>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="soft-panel">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Work Orders</p>
                  <span className="text-xs text-[#9CA8BA]">14 active</span>
                </div>
                <div className="space-y-2">
                  {workOrders.map(([wo, name, op, status], index) => (
                    <div key={wo} className="grid grid-cols-[0.65fr_1fr_0.45fr_0.5fr] items-center gap-2 rounded-lg border border-[#263244] bg-[#080D15] px-3 py-2.5 text-xs">
                      <span className="font-bold text-white">{wo}</span>
                      <span className="truncate text-[#B8C2D2]">{name}</span>
                      <span className="text-[#62D6FF]">{op}</span>
                      <Chip tone={index === 0 ? "blue" : index === 2 ? "amber" : "green"}>{status}</Chip>
                    </div>
                  ))}
                </div>
              </div>

              <div className="soft-panel">
                <p className="text-sm font-semibold text-white">Active Operation</p>
                <div className="mt-3 rounded-lg border border-[#3F8CFF]/30 bg-[#3F8CFF]/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#62D6FF]">WO-4827 OP30</span>
                    <Chip tone="green">Running</Chip>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">Final inspection</p>
                  <div className="mt-3 h-2 rounded-full bg-[#263244]">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#3F8CFF] to-[#62D6FF]" />
                  </div>
                </div>
              </div>

              <div className="soft-panel">
                <p className="text-sm font-semibold text-white">Ballooned Inspection</p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8"].map((num, index) => (
                    <div key={num} className={`rounded-md border px-2 py-2 text-center text-xs font-bold ${index === 5 ? "border-[#F5A524]/40 bg-[#F5A524]/10 text-[#F5A524]" : "border-[#24C47E]/30 bg-[#24C47E]/10 text-[#24C47E]"}`}>
                      B{num}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#9CA8BA]">7 pass, 1 review, 0 missing</p>
              </div>

              <div className="grid gap-4">
                <div className="soft-panel">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Employee Time</p>
                    <Chip tone="green">Clocked in</Chip>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">6.25 hrs</p>
                  <p className="text-xs text-[#9CA8BA]">John Smith to WO-4827 OP30</p>
                </div>
                <div className="soft-panel">
                  <p className="text-sm font-semibold text-white">Packet Readiness</p>
                  <div className="mt-3 space-y-2 text-xs text-[#B8C2D2]">
                    <div className="flex justify-between"><span>Traveler</span><span className="text-[#24C47E]">Released</span></div>
                    <div className="flex justify-between"><span>Print Rev</span><span className="text-[#62D6FF]">C</span></div>
                    <div className="flex justify-between"><span>QR Evidence</span><span className="text-[#F5A524]">Required</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-stats-strip">
              <div><span>Packet health</span><strong>96%</strong></div>
              <div><span>Open exceptions</span><strong>2</strong></div>
              <div><span>Floor sync</span><strong>Live</strong></div>
            </div>
          </div>

          <div className="phone-card">
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#263244]" />
            <p className="text-xs font-bold uppercase text-[#62D6FF]">Mobile capture</p>
            <h3 className="mt-1 text-lg font-semibold text-white">QR Evidence</h3>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} className={`h-5 rounded-sm ${index % 3 === 0 ? "bg-[#62D6FF]" : index % 4 === 0 ? "bg-[#3F8CFF]" : "bg-[#263244]"}`} />
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-[#263244] bg-[#080D15] p-3">
              <p className="text-xs text-[#9CA8BA]">Photo + note captured</p>
              <p className="mt-1 text-sm font-semibold text-[#24C47E]">Attached to OP30</p>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 bg-[#080D15] py-6">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-8">
          <div className="chain-panel">
            {workflow.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`chain-pill ${index === 1 || index === 3 || index === 4 ? "chain-pill-active" : ""}`}>{step}</span>
                {index < workflow.length - 1 ? <span className="chain-arrow">-&gt;</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap" aria-labelledby="feature-heading">
        <div className="mb-8 max-w-3xl">
          <p className="section-kicker">Production system of record</p>
          <h2 id="feature-heading" className="section-title">One controlled path from quote-ready routing to shipment-ready proof.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="flex items-start justify-between gap-4">
                <span className="feature-badge">{feature.badge}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#263244] to-transparent" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[#9CA8BA]">{feature.copy}</p>
              <div className="mt-6 grid gap-2">
                {feature.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2 text-sm text-[#B8C2D2]">
                    <StatusDot color="bg-[#62D6FF]" />
                    {bullet}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="inspection" className="section-band">
        <div className="mx-auto grid max-w-[90rem] gap-9 px-5 py-14 sm:px-6 lg:grid-cols-[1.18fr_0.82fr] lg:px-8">
          <div className="inspection-board">
            <div className="drawing-preview">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num, index) => (
                <span key={num} className={`balloon b${index + 1}`}>{num}</span>
              ))}
              <div className="drawing-shape drawing-shape-a" />
              <div className="drawing-shape drawing-shape-b" />
              <div className="drawing-line line-a" />
              <div className="drawing-line line-b" />
              <div className="drawing-line line-c" />
            </div>
            <div className="inspection-table">
              <div className="table-row table-head">
                <span>Balloon</span><span>Feature</span><span>Nominal</span><span>Tol</span><span>Result</span><span>Status</span>
              </div>
              {inspectionRows.map(([balloon, feature, nominal, tol, result, status]) => (
                <div key={balloon} className="table-row">
                  <span className="font-bold text-[#62D6FF]">B{balloon}</span>
                  <span>{feature}</span>
                  <span>{nominal}</span>
                  <span>{tol}</span>
                  <span>{result}</span>
                  <Chip tone={status === "Pass" ? "green" : status === "Fail" ? "red" : "amber"}>{status}</Chip>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="section-kicker">Ballooned drawings and inspection</p>
            <h2 className="section-title">Ballooned drawings that stay tied to the work order.</h2>
            <p className="mt-5 leading-8 text-[#B8C2D2]">
              RunBook connects released drawings, balloon numbers, inspection templates, and first article/in-process/final results to the active job packet.
            </p>
            <div className="mt-7 grid gap-3">
              {["Create ballooned drawing packets", "Build inspection templates by operation", "Capture first article, in-process, and final results", "Keep results tied to released work orders"].map((item) => (
                <div key={item} className="benefit-row"><CheckIcon /><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="time-control" className="section-wrap grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="time-dashboard">
          <div className="flex items-center justify-between border-b border-[#263244] pb-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#62D6FF]">Supervisor time dashboard</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Labor Control</h3>
            </div>
            <Chip tone="blue">Policy-based</Chip>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Active now", "7", "green"],
              ["Needs review", "2", "amber"],
              ["Labor captured today", "84.5", "blue"],
            ].map(([label, value, tone]) => (
              <div key={label} className="metric-card">
                <p className="text-xs text-[#9CA8BA]">{label}</p>
                <p className={`mt-1 text-2xl font-semibold ${tone === "green" ? "text-[#24C47E]" : tone === "amber" ? "text-[#F5A524]" : "text-[#62D6FF]"}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[#263244]">
            {timeRows.map(([name, status, job, hours, tone]) => (
              <div key={name} className="grid gap-3 border-b border-[#263244] bg-[#080D15] p-3 text-sm last:border-b-0 sm:grid-cols-[1fr_0.75fr_1fr_0.45fr] sm:items-center">
                <span className="font-semibold text-white">{name}</span>
                <Chip tone={tone as "green" | "amber" | "red" | "gray"}>{status}</Chip>
                <span className="text-[#B8C2D2]">{job}</span>
                <span className="font-semibold text-white">{hours}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="exception-panel">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Exception Review Queue</p>
                <Chip tone="amber">3 open</Chip>
              </div>
              <div className="grid gap-2">
                {exceptionRows.map(([issue, owner, action, tone]) => (
                  <div key={`${issue}-${owner}`} className="exception-row">
                    <div>
                      <p className="font-semibold text-white">{issue}</p>
                      <p className="mt-0.5 text-xs text-[#9CA8BA]">{owner}</p>
                    </div>
                    <Chip tone={tone as "amber" | "red"}>{action}</Chip>
                  </div>
                ))}
              </div>
            </div>
            <div className="labor-bars">
              <p className="mb-3 text-sm font-semibold text-white">Labor by Operation</p>
              {[
                ["OP10 Setup", "70%"],
                ["OP20 Run", "84%"],
                ["OP30 Inspection", "58%"],
              ].map(([label, width]) => (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="mb-1 flex justify-between text-xs text-[#9CA8BA]"><span>{label}</span><span>{width}</span></div>
                  <div className="h-2 rounded-full bg-[#263244]"><div className="h-full rounded-full bg-gradient-to-r from-[#3F8CFF] to-[#62D6FF]" style={{ width }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="time-bottom-strip">
            Today: <strong>84.5 hrs captured</strong> | <strong>7 active</strong> | <strong>2 needs review</strong>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="section-kicker">Employee time control</p>
          <h2 className="section-title">Labor accountability without slowing down the floor.</h2>
          <p className="mt-5 leading-8 text-[#B8C2D2]">
            Operators clock in/out against jobs and operations while supervisors keep policy-based review control.
          </p>
          <div className="mt-7 grid gap-3">
            {["Enforce clock-in/out policies", "Tie labor to work orders and operations", "Review exceptions before payroll", "See job labor before the order ships"].map((item) => (
              <div key={item} className="benefit-row"><CheckIcon /><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band comparison-section">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">Built for real shops</p>
            <h2 className="section-title">Not a bloated ERP. Not just a task board.</h2>
            <p className="mt-5 leading-8 text-[#B8C2D2]">
              RunBook sits in the practical middle ground: controlled enough for real manufacturing execution, focused enough for job shops that need work to move without ERP drag.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["CNC job shops", "Swiss machining", "Turning and milling", "Inspection-heavy work"].map((shop) => (
                <div key={shop} className="shop-card">{shop}</div>
              ))}
            </div>
          </div>
          <div className="comparison-card">
            {comparisons.map(([name, copy, tone]) => (
              <div key={name} className={`comparison-row comparison-${tone}`}>
                <div className="flex items-center gap-3">
                  <span className="comparison-icon" />
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="mt-1 text-sm text-[#9CA8BA]">{copy}</p>
                  </div>
                </div>
                <Chip tone={tone === "blue" ? "blue" : tone === "amber" ? "amber" : "gray"}>
                  {tone === "blue" ? "Best fit" : tone === "amber" ? "Partial" : "Heavy"}
                </Chip>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request-demo" className="relative z-10 mx-auto max-w-[90rem] px-5 py-14 sm:px-6 lg:px-8">
        <div className="cta-panel">
          <div>
            <p className="section-kicker">Request demo</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-5xl">See how RunBook can control your shop floor.</h2>
            <p className="mt-5 max-w-3xl text-[#B8C2D2]">Built for CNC shops, Swiss machining, turning, milling, and inspection-heavy production.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/request-demo" className="btn-primary">Request Demo <ArrowIcon /></a>
              <a href="/request-demo" className="btn-secondary">Contact Us</a>
            </div>
            <div id="trial-preview" className="trial-note">
              <p className="font-semibold text-white">Want to test it yourself?</p>
              <p className="mt-1 text-sm leading-6 text-[#9CA8BA]">
                A 30-day self-install trial is planned before launch.
              </p>
            </div>
          </div>
          <div className="cta-mini-stack">
            {ctaPanels.map(([title, copy, tone]) => (
              <div key={title} className={`cta-mini-panel cta-mini-${tone}`}>
                <span className="feature-badge">{title.slice(0, 2).toUpperCase()}</span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#9CA8BA]">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer-shell relative z-10 border-t border-[#263244] bg-[#05070C]">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1.35fr_repeat(4,1fr)] lg:px-8">
          <div>
            <p className="text-lg font-semibold text-white">RunBook</p>
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
                  <a key={link} href={link === "Request Demo" ? "/request-demo" : "#product"} className="hover:text-white">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
