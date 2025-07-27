export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const pixelId = process.env.FB_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return res.status(500).json({ message: 'Missing Pixel ID or Access Token' });
  }

  try {
    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [req.body], // Postman body should match Facebook format
          test_event_code: req.body.test_event_code || undefined // optional
        }),
      }
    );

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      return res.status(400).json({ error: 'Facebook API error', details: fbData });
    }

    return res.status(200).json({ message: 'Event sent to Facebook', fbResponse: fbData });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
