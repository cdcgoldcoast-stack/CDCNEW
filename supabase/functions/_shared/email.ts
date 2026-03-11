import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SupabaseClient = ReturnType<typeof createClient>;

const RESEND_API_URL = "https://api.resend.com/emails";

export interface NotificationSettings {
  from_email: string;
  from_name: string;
  notification_emails: string[];
}

export const getNotificationSettings = async (
  supabase: SupabaseClient,
): Promise<NotificationSettings> => {
  const { data } = await supabase
    .from("notification_settings")
    .select("from_email, from_name, notification_emails")
    .limit(1)
    .maybeSingle();

  return {
    from_email: data?.from_email || "hello@cdconstruct.com.au",
    from_name: data?.from_name || "Concept Design Construct",
    notification_emails: Array.isArray(data?.notification_emails) ? data.notification_emails : [],
  };
};

export const sendEmail = async ({
  apiKey,
  from,
  to,
  subject,
  html,
}: {
  apiKey: string;
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> => {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API error (${res.status}): ${text}`);
  }
};

// ─── Shared layout helpers ────────────────────────────────────────────────────
// Brand: Red #C8102E, Cream #FFFEEF, Dark #0C0507, Georgia headings, Helvetica Neue body

const emailWrapper = (content: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Concept Design Construct</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f2e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f2e8;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        ${content}
        <!-- Footer -->
        <tr><td style="padding:28px 0 8px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#8a7e72;line-height:1.6;">
            Concept Design Construct &nbsp;·&nbsp; Gold Coast, QLD<br />
            <a href="https://www.cdconstruct.com.au" style="color:#C8102E;text-decoration:none;">www.cdconstruct.com.au</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const headerBlock = (subtitle: string, title: string) => `
<tr><td style="background:#0C0507;padding:44px 40px 40px;text-align:center;">
  <p style="margin:0 0 14px;font-size:11px;color:#C8102E;letter-spacing:3px;text-transform:uppercase;font-weight:600;">${subtitle}</p>
  <h1 style="margin:0;color:#FFFEEF;font-size:26px;font-weight:400;letter-spacing:-0.01em;line-height:1.2;font-family:Georgia,'Times New Roman',serif;">${title}</h1>
</td></tr>`;

const bodyCard = (inner: string) => `
<tr><td style="background:#FFFEEF;padding:36px 40px 40px;">
  ${inner}
</td></tr>`;

const detailRow = (label: string, value: string) =>
  value
    ? `<tr>
        <td style="padding:8px 0;font-size:13px;color:#8a7e72;width:140px;vertical-align:top;">${label}</td>
        <td style="padding:8px 0 8px 12px;font-size:13px;color:#1A0C10;font-weight:500;vertical-align:top;">${value}</td>
       </tr>`
    : "";

const summaryBox = (rows: string) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f2e8;border-left:3px solid #C8102E;margin:0 0 28px;">
  <tr><td style="padding:20px 24px;">
    <p style="margin:0 0 14px;font-size:11px;color:#8a7e72;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Submission details</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </td></tr>
</table>`;

const ctaButton = (href: string, label: string) => `
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
  <tr>
    <td style="background:#C8102E;">
      <a href="${href}" style="display:inline-block;padding:13px 26px;color:#FFFEEF;text-decoration:none;font-size:12px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;">${label} &rarr;</a>
    </td>
  </tr>
</table>`;

// ─── User confirmation emails ─────────────────────────────────────────────────

export const buildEnquiryConfirmationEmail = ({
  name,
  renovations,
  budget,
  suburb,
}: {
  name: string;
  renovations: string[];
  budget?: string;
  suburb?: string;
}): string => {
  const detailRows = [
    detailRow("Name", name),
    detailRow("Renovation(s)", renovations.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")),
    detailRow("Budget", budget || ""),
    detailRow("Suburb", suburb || ""),
  ].join("");

  const body = `
    <p style="margin:0 0 20px;font-size:16px;color:#2d2d2d;line-height:1.6;">Hi ${name},</p>
    <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.7;">
      Thanks for reaching out — we've received your renovation enquiry and a member of our team will be in touch very shortly.
    </p>
    ${summaryBox(detailRows)}
    <p style="margin:0 0 8px;font-size:14px;color:#555;font-weight:600;">What happens next?</p>
    <p style="margin:0 0 28px;font-size:14px;color:#777;line-height:1.7;">
      One of our project consultants will call you to learn more about your vision and discuss how we can bring it to life.
    </p>
    ${ctaButton("https://www.cdconstruct.com.au/renovation-projects", "View Our Recent Work")}
    <p style="margin:0;font-size:14px;color:#999;line-height:1.6;">
      Got a question? Simply reply to this email.<br />
      <span style="color:#555;font-weight:500;">— The CDC Team</span>
    </p>`;

  return emailWrapper(headerBlock("Concept Design Construct", "We've received your enquiry") + bodyCard(body));
};

export const buildChatConfirmationEmail = ({
  name,
  summary,
}: {
  name: string;
  summary?: string;
}): string => {
  const summarySection = summary
    ? `${summaryBox(`<tr><td colspan="2" style="padding:4px 0;font-size:13px;color:#555;line-height:1.6;">${summary}</td></tr>`)}`
    : "";

  const body = `
    <p style="margin:0 0 20px;font-size:16px;color:#2d2d2d;line-height:1.6;">Hi ${name},</p>
    <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.7;">
      Thanks for chatting with us! We've saved your details and a member of our team will follow up with you directly very shortly.
    </p>
    ${summarySection}
    ${ctaButton("https://www.cdconstruct.com.au/renovation-projects", "Explore Our Projects")}
    <p style="margin:0;font-size:14px;color:#999;line-height:1.6;">
      Got a question? Simply reply to this email.<br />
      <span style="color:#555;font-weight:500;">— The CDC Team</span>
    </p>`;

  return emailWrapper(headerBlock("Concept Design Construct", "Thanks for chatting with us") + bodyCard(body));
};

export const buildReferralConfirmationEmail = ({
  affiliateName,
  referralName,
}: {
  affiliateName: string;
  referralName: string;
}): string => {
  const body = `
    <p style="margin:0 0 20px;font-size:16px;color:#2d2d2d;line-height:1.6;">Hi ${affiliateName},</p>
    <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.7;">
      Your referral has been received — thank you! We'll be reaching out to <strong style="color:#2d2d2d;">${referralName}</strong> to discuss their renovation project.
    </p>
    ${summaryBox(detailRow("Referred", referralName))}
    <p style="margin:0 0 8px;font-size:14px;color:#555;font-weight:600;">Your referral commission</p>
    <p style="margin:0 0 28px;font-size:14px;color:#777;line-height:1.7;">
      If ${referralName} proceeds with a renovation, you'll receive your referral commission once their project is confirmed. We'll keep you updated throughout the process.
    </p>
    ${ctaButton("https://www.cdconstruct.com.au/referral", "Refer Another Friend")}
    <p style="margin:0;font-size:14px;color:#999;line-height:1.6;">
      Questions? Simply reply to this email.<br />
      <span style="color:#555;font-weight:500;">— The CDC Team</span>
    </p>`;

  return emailWrapper(headerBlock("Concept Design Construct", "Your referral has been received") + bodyCard(body));
};

// ─── Team notification emails ─────────────────────────────────────────────────

export const buildEnquiryNotificationEmail = ({
  name,
  email,
  phone,
  suburb,
  renovations,
  budget,
  timeline,
  adminUrl = "https://www.cdconstruct.com.au/admin/enquiries",
}: {
  name: string;
  email: string;
  phone: string;
  suburb?: string;
  renovations: string[];
  budget?: string;
  timeline?: string;
  adminUrl?: string;
}): string => {
  const rows = [
    detailRow("Name", name),
    detailRow("Email", email),
    detailRow("Phone", phone),
    detailRow("Suburb", suburb || ""),
    detailRow("Renovation(s)", renovations.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")),
    detailRow("Budget", budget || ""),
    detailRow("Timeline", timeline || ""),
    detailRow("Received", new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })),
  ].join("");

  const body = `
    ${summaryBox(rows)}
    ${ctaButton(adminUrl, "View in Admin")}
    <p style="margin:0;font-size:13px;color:#aaa;">This is an automated notification from your CDC website.</p>`;

  return emailWrapper(headerBlock("New Enquiry", `${name} wants to discuss a renovation`) + bodyCard(body));
};

export const buildChatNotificationEmail = ({
  name,
  phone,
  email,
  notes,
  summary,
  adminUrl = "https://www.cdconstruct.com.au/admin/chat-inquiries",
}: {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  summary?: string;
  adminUrl?: string;
}): string => {
  const rows = [
    detailRow("Name", name),
    detailRow("Phone", phone),
    detailRow("Email", email || ""),
    detailRow("Notes", notes || ""),
    detailRow("AI Summary", summary || ""),
    detailRow("Received", new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })),
  ].join("");

  const body = `
    ${summaryBox(rows)}
    ${ctaButton(adminUrl, "View in Admin")}
    <p style="margin:0;font-size:13px;color:#aaa;">This is an automated notification from your CDC website.</p>`;

  return emailWrapper(headerBlock("New Chat Inquiry", `${name} submitted via the AI chat`) + bodyCard(body));
};

export const buildPopupNotificationEmail = ({
  name,
  phone,
  source,
  pageUrl,
  adminUrl = "https://www.cdconstruct.com.au/admin/popup-responses",
}: {
  name: string;
  phone: string;
  source: string;
  pageUrl?: string;
  adminUrl?: string;
}): string => {
  const rows = [
    detailRow("Name", name),
    detailRow("Phone", phone),
    detailRow("Source", source),
    detailRow("Page", pageUrl || ""),
    detailRow("Received", new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })),
  ].join("");

  const body = `
    ${summaryBox(rows)}
    ${ctaButton(adminUrl, "View in Admin")}
    <p style="margin:0;font-size:13px;color:#aaa;">This is an automated notification from your CDC website.</p>`;

  return emailWrapper(headerBlock("New Popup Lead", `${name} submitted via the popup`) + bodyCard(body));
};

export const buildReferralNotificationEmail = ({
  affiliateName,
  affiliateEmail,
  affiliatePhone,
  referralName,
  referralPhone,
  referralEmail,
  referralSuburb,
  adminUrl = "https://www.cdconstruct.com.au/admin/enquiries",
}: {
  affiliateName: string;
  affiliateEmail: string;
  affiliatePhone: string;
  referralName: string;
  referralPhone: string;
  referralEmail?: string;
  referralSuburb?: string;
  adminUrl?: string;
}): string => {
  const rows = [
    `<tr><td colspan="2" style="padding:8px 0 4px;font-size:11px;color:#C8102E;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Referred by</td></tr>`,
    detailRow("Name", affiliateName),
    detailRow("Email", affiliateEmail),
    detailRow("Phone", affiliatePhone),
    `<tr><td colspan="2" style="padding:16px 0 4px;font-size:11px;color:#C8102E;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Referral (potential client)</td></tr>`,
    detailRow("Name", referralName),
    detailRow("Phone", referralPhone),
    detailRow("Email", referralEmail || ""),
    detailRow("Suburb", referralSuburb || ""),
    detailRow("Received", new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })),
  ].join("");

  const body = `
    ${summaryBox(rows)}
    ${ctaButton(adminUrl, "View in Admin")}
    <p style="margin:0;font-size:13px;color:#aaa;">This is an automated notification from your CDC website.</p>`;

  return emailWrapper(headerBlock("New Referral", `${affiliateName} referred ${referralName}`) + bodyCard(body));
};
