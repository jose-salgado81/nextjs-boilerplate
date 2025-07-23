import crypto from 'crypto';

function hash(value) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event_id, event_name, email, phone, value, currency } = req.body;

  const payload = {
    data: [{
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      action_source: "website",
      user_data: {
        em: [hash(email)],
        ph: [hash(phone)],
        ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      },
      custom_data: {
        value,
        currency
      }
    }]
  };

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/1051240707176632/events?access_token=EAAKGs42GiTIBPLqT50ZCUZApPYUSB7xgHL4DMvLV6JfnkbN1MKCZBxOnOlQ75yUC4n4om0BVKob8arPknuI1X0zIrsZAD51qlTaU3h40u4d9lhza4cYexwSXTwxS3q2tIYZB29k2LZBV8dhAwcJY5XhNQguM3ZBFqpk3Nc880JIQL8PrEGSHUhayEZAkWrTUN1sZCIwZDZD`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
