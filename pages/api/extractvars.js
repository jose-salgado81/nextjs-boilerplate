export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received payload:', req.body); // This shows up in Vercel's logs

    return res.status(200).json({
      message: 'Payload received',
      received: req.body,
    });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
