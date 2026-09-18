// CIBN BOT checkout — Flutterwave NGN rail (owner-set: NGN only, no USD conversion).
// Pricing v8 (owner-set, Sept 18): Level One ₦22,500 · Pass Package ₦36,000 ·
// Exam-Day Command ₦19,250 · Rescue Resit ₦6,750 · B2B ₦25,000/staff.

const PLANS = {
  pass_package:  { ngn: 36000, label: "CIBN BOT — PASS PACKAGE: all 6 MCP courses, one diet (mocks, coaching, concierge, proctoring prep, alerts, appeal support)" },
  level_one:    { ngn: 22500, label: "CIBN BOT — LEVEL ONE: first 3 courses (Accreditation I: MF301, MF302, MF303)" },
  exam_command: { ngn: 19250, label: "CIBN BOT — Exam-Day Command (proctoring-ready check, room-scan rehearsal, live exam-day support, results & appeal follow-through)" },
  rescue_resit: { ngn: 6750,  label: "CIBN BOT — Rescue Resit (per failed course: appeal check + retake plan + targeted coaching)" },
  mock_full:    { ngn: 15000, label: "CIBN BOT — Mock Season, full diet, all courses" },
  mock_single:  { ngn: 3500,  label: "CIBN BOT — Mock Season, 1 course" },
  coaching_1:   { ngn: 5000,  label: "CIBN BOT — Coaching, 1 course (branch classes charge ₦10,000)" },
  reg_concierge:{ ngn: 5000,  label: "CIBN BOT — Registration & Materials Concierge" },
  b2b_staff:    { ngn: 25000, label: "CIBN BOT — B2B Pass Bundle, per staff (20% off teams of 5+)" },
};

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
  let amount = plan.ngn * qty;
  if (planId === "b2b_staff" && qty >= 5) amount = Math.round(amount * 0.8); // 20% off teams of 5+

  const secret = process.env.FLW_SECRET_KEY;
  if (!secret) {
    return res.status(200).json({
      ok: false,
      error: "Online payment activates shortly. Reach us on WhatsApp 0704 648 1828 to lock in your spot now — registration closes Wednesday."
    });
  }

  const email = String(body.email || "").trim().slice(0, 180);
  const txRef = "cibn-" + planId + "-" + qty + "-" + Date.now();
  try {
    const r = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + secret },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: amount,
        currency: "NGN",
        redirect_url: "https://mcp-bot-eight.vercel.app/?paid=1&plan=" + planId,
        customer: email ? { email: email } : undefined,
        customizations: {
          title: "CIBN BOT · Institute GPT",
          description: plan.label + (qty > 1 ? " × " + qty : "")
        },
        meta: { plan: planId, quantity: qty }
      })
    });
    const d = await r.json().catch(() => null);
    if (d && d.status === "success" && d.data && d.data.link) {
      return res.status(200).json({ ok: true, checkout_url: d.data.link, tx_ref: txRef, amount: amount });
    }
    return res.status(502).json({ ok: false, error: "Payment gateway unavailable — reach us on WhatsApp 0704 648 1828." });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Payment gateway unreachable — reach us on WhatsApp 0704 648 1828." });
  }
};
