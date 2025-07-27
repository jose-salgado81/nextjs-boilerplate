export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const pixelId = process.env.FB_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;
  const testEventCode = req.query.test_event_code; // get from query string

  const bodyData = {
    data: [req.body],
  };

  // Add test_event_code only if it exists
  if (testEventCode) {
    bodyData.test_event_code = testEventCode;
  }

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      }
    );

    const fbData = await fbRes.json();
    console.log('FB Response:', fbData);

    if (!fbRes.ok) {
      return res.status(400).json({ error: 'Facebook API error', details: fbData });
    }

    return res.status(200).json({ message: 'Event sent to Facebook', fbResponse: fbData });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
