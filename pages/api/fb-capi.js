export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  console.log('Received payload:', req.body); // Optional, for Vercel logs

  return res.status(200).json({
    message: 'Payload received successfully',
    received: req.body
  });
}
