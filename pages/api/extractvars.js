export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Respond to CORS preflight
    return res.status(200).end();
  }

  if (req.method === "POST") {
    console.log("POST received:", req.body);
    return res.status(200).json({ status: "ok", received: req.body });
  }

  if (req.method === "GET") {
    return res.status(200).json({ message: "API is live" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
