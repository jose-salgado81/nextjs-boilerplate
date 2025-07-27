export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const pixelId = process.env.FB_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;

  try {
    // Copy incoming body and override event_time with current Unix timestamp in seconds
    const eventPayload = {
      ...req.body,
      event_time: Math.floor(Date.now() / 1000),
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventPayload],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: 'Facebook API error', details: data });
    }

    return res.status(200).json({ message: 'Event sent to Facebook', fbResponse: data });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
