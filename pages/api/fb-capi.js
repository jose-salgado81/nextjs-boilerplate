export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  res.status(200).json({ received: req.body });
}
