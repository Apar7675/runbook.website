type DemoLead = {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  shopType?: string;
  mainInterest?: string;
  message?: string;
};

const requiredFields: Array<keyof DemoLead> = [
  "firstName",
  "lastName",
  "company",
  "email",
  "shopType",
  "mainInterest",
];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatLeadEmail(lead: Required<DemoLead>) {
  return [
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "Not provided"}`,
    `Shop Type: ${lead.shopType}`,
    `Main Interest: ${lead.mainInterest}`,
    "",
    "Message:",
    lead.message || "Not provided",
  ].join("\n");
}

export async function POST(request: Request) {
  let body: DemoLead;

  try {
    body = (await request.json()) as DemoLead;
  } catch {
    return Response.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 },
    );
  }

  const lead = {
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    company: clean(body.company),
    email: clean(body.email),
    phone: clean(body.phone),
    shopType: clean(body.shopType),
    mainInterest: clean(body.mainInterest),
    message: clean(body.message),
  };

  const missingRequiredField = requiredFields.some((field) => !lead[field]);

  if (missingRequiredField) {
    return Response.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 },
    );
  }

  const requestId = crypto.randomUUID();

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RUNBOOK_LEADS_TO_EMAIL;
  const fromEmail = process.env.RUNBOOK_LEADS_FROM_EMAIL;

  if (!resendApiKey) {
    console.info("RunBook demo request accepted in local development.", {
      requestId,
    });

    return Response.json({
      ok: true,
      devMode: true,
      requestId,
      message: "Demo request accepted locally; details were not stored or sent.",
    });
  }

  if (!toEmail || !fromEmail) {
    return Response.json(
      {
        ok: false,
        requestId,
        error: "Email is not configured for this environment.",
      },
      { status: 500 },
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmail,
      subject: `New RunBook demo request from ${lead.company}`,
      text: formatLeadEmail(lead),
    }),
  });

  if (!resendResponse.ok) {
    console.error("RunBook demo request delivery failed.", {
      requestId,
      providerStatus: resendResponse.status,
    });

    return Response.json(
      {
        ok: false,
        requestId,
        error: "Unable to send demo request right now.",
      },
      { status: 502 },
    );
  }

  console.info("RunBook demo request accepted for delivery.", { requestId });

  return Response.json({
    ok: true,
    requestId,
    message: "Thanks — your demo request was received. We’ll reach out soon.",
  });
}
