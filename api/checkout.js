// CIBN BOT checkout — serverless, NGN-only display (USD internal for Stripe processing)
// Owner pricing v3 (Sept 17, 2026): Pass Package ₦30,000 all 6 courses one diet.

const PLANS = {
  mock_single:   { usd_cents: 299,  label: "CIBN BOT — Mock Season, 1 course (incl. VAT)" },
  mock_full:     { usd_cents: 999,  label: "CIBN BOT — Mock Season, full diet, all courses (incl. VAT)" },
  reg_concierge: { usd_cents: 350,  label: "CIBN BOT — Registration & Materials Concierge" },
  coaching_1:    { usd_cents: 350,  label: "CIBN BOT — Coaching, 1 course — you save ₦5,000 vs branch classes" },
  b2b_staff:     { usd_cents: 1699, label: "CIBN BOT — B2B per-staff Pass Bundle (20% off 5+ staff)" },
  pass_package:  { usd_cents: 1999, label: "CIBN BOT — PASS PACKAGE: all 6 courses, one diet — mocks + coaching + concierge + proctoring prep + alerts + appeal support" },
};

function formEncode(obj) {
  return Object.keys(obj).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k])).join("&");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST only" });
  let body = {};
  try { body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body || "{}"); } catch (e) { body = {}; }

  const planId = String(body.plan || "");
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ ok: false, error: "Unknown plan" });

  let qty = parseInt(body.quantity, 10) || 1;
  if (qty < 1) qty = 1;
  if (qty > 500) qty = 500;
  const email = String(body.email || "").trim().slice(0, 180);

  const params = {
    mode: "payment",
    success_url: "https://mcp-bot-eight.vercel.app/?paid=1&plan=" + planId,
    cancel_url: "https://mcp-bot-eight.vercel.app/?cancelled=1",
    client_reference_id: "cibn-" + planId + "-" + Date.now(),
    "line_items[0][quantity]": String(qty),
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(plan.usd_cents),
    "line_items[0][price_data][product_data][name]": plan.label,
  };
  if (email) params.customer_email = email;

  try {
    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formEncode(params),
    });
    const session = await resp.json().catch(() => ({}));
    if (!resp.ok || !session || !session.url) {
      return res.status(502).json({ ok: false, error: (session && session.error && session.error.message) || "Stripe session failed" });
    }
    return res.status(200).json({ ok: true, checkout_url: session.url });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Checkout is temporarily unavailable" });
  }
};
