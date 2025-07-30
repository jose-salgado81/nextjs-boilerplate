export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Log the received data to Vercel runtime logs
    console.log('Received data from GTM:', body);

    return res.status(200).json({ message: 'Data received', received: body });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
