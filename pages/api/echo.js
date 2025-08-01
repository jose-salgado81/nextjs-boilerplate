export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Received payload:', req.body); // Logs to Vercel Function Logs

  res.status(200).json({
    message: 'Payload received now',
    received: req.body
  });
}

