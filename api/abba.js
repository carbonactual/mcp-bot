/**
 * ABBA product surface — CIBN Bot.
 * Reports presence, contract and capability. Creates no authority, moves no value.
 */
const MANIFEST = {
  agent: "ABBA",
  ecosystem: "Carbon Actual",
  product: "CIBN Bot",
  division: "Bot",
  contract: "ABBA-PRODUCT-SURFACE-V1",
  capabilities: ["syllabus-query","exam-guidance","member-assist"],
  boundary:
    "Advisory only. This surface reports that ABBA is present in this product; it creates no authority, moves no value and stores no personal data.",
  runtime: "vercel-function",
};

module.exports = function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ error: "method_not_allowed", allow: "GET" });
    return;
  }
  res.status(200).json({ ...MANIFEST, status: "alive", checkedAt: new Date().toISOString() });
}
