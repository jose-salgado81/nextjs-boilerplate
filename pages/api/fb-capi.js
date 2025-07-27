export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    event_name,
    event_id,
    event_time,
    source,
    fbc,
    user_data,
    custom_data,
    test_event_code,
  } = req.body;

  // Construct payload exactly as received, add required fields if missing
  const payload = {
    data: [
      {
        event_name,
        event_id,
        event_time: event_time || Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          ...user_data,
          fbc: fbc || null,
          client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          client_user_agent: req.headers['user-agent'],
        },
        custom_data: custom_data || {},
        test_event_code: test_event_code || undefined,
      },
    ],
  };

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/1051240707176632/events?access_token=YOUR_ACCESS_TOKEN`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await fbRes.json();

    if (!fbRes.ok) {
      return res.status(fbRes.status).json({ error: json });
    }

    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
