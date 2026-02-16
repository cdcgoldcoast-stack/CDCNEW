const DEFAULT_ALERT_MODE = "off";

function inferAlertMode(value) {
  const mode = `${value || DEFAULT_ALERT_MODE}`.trim().toLowerCase();
  if (!mode) return DEFAULT_ALERT_MODE;

  if (["off", "stdout", "webhook", "slack", "email", "github", "custom"].includes(mode)) {
    return mode;
  }

  return DEFAULT_ALERT_MODE;
}

function resolveAlertTarget(mode) {
  if (mode === "webhook" || mode === "custom") {
    return process.env.SEO_ALERT_TARGET || process.env.SEO_ALERT_WEBHOOK_URL || "";
  }

  if (mode === "slack") {
    return process.env.SEO_ALERT_TARGET || process.env.SEO_ALERT_SLACK_WEBHOOK || "";
  }

  if (mode === "email") {
    return process.env.SEO_ALERT_TARGET || process.env.SEO_ALERT_EMAIL_WEBHOOK || "";
  }

  if (mode === "github") {
    return process.env.SEO_ALERT_TARGET || process.env.SEO_ALERT_GITHUB_WEBHOOK || "";
  }

  return "";
}

function buildPayload({ reportType, summaryText, highestSeverity, report }) {
  return {
    reportType,
    summary: summaryText,
    highestSeverity,
    generatedAt: new Date().toISOString(),
    report,
  };
}

export async function sendAlert({
  reportType,
  summaryText,
  highestSeverity,
  report,
}) {
  const mode = inferAlertMode(process.env.SEO_ALERT_MODE);

  if (mode === "off") {
    return { sent: false, mode, reason: "disabled" };
  }

  if (mode === "stdout") {
    console.log(`[alert:${reportType}] ${summaryText}`);
    return { sent: true, mode };
  }

  const target = resolveAlertTarget(mode);
  if (!target) {
    console.warn(`[alert:${reportType}] mode=${mode} but no target configured; skipping.`);
    return { sent: false, mode, reason: "missing_target" };
  }

  if (!/^https?:\/\//i.test(target)) {
    console.warn(`[alert:${reportType}] target is not an HTTP URL; skipping.`);
    return { sent: false, mode, reason: "invalid_target" };
  }

  const payload = buildPayload({ reportType, summaryText, highestSeverity, report });

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const snippet = await response.text();
      console.warn(
        `[alert:${reportType}] ${mode} notification failed (${response.status}): ${snippet.slice(0, 240)}`
      );
      return { sent: false, mode, reason: "http_error", status: response.status };
    }

    return { sent: true, mode };
  } catch (error) {
    console.warn(`[alert:${reportType}] ${mode} notification failed:`, error);
    return { sent: false, mode, reason: "network_error" };
  }
}

