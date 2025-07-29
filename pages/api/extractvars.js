export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("Received POST:", req.body);
    res.status(200).json({ status: "ok", received: req.body });
  } else if (req.method === "GET") {
    res.status(200).json({ message: "GET request received - endpoint is live" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
