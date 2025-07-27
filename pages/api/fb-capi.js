import crypto from 'crypto';

function hash(value) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

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
    test_event_code
  } = req.body;

  let emHashed = user_data?.em;
  let phHashed = user_data?.ph;

  if (emHashed && !emHashed[0]?.match(/^[a-f0-9]{64}$/i)) {
    emHashed = [hash(emHashed[0])];
  }
  if (phHashed && !phHashed[0]?.match(/^[a-f0-9]{64}$/i)) {
    phHashed = [hash(phHashed[0])];
  }

  const payload = {
    data: [{
      event_name,
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_id,
      action_source: "website",
      user_data: {
        em: emHashed || [],
        ph: phHashed || [],
        fbc: fbc || null,
        client_user_agent: user_data?.client_user_agent || req.headers['user-agent'],
        client_ip_address: user_data?.client_ip_address || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      },
      custom_data: custom_data || {},
      test_event_code: test_event_code || undefined
    }]
  };

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/706967978816541/events?access_token=EAANtXefOJ9MBPKeq80ZBRuhEE5rJ8N7Jf2oBQtBvdRrwKLwQDZA53wlwf9X1H9Te6LEZC8DjIMMQ60GZACnV9GKyhpjBnvZCfHP8ZCAW6K7xxlOhGSmmqTkQOfBxZAcyic1xKXmBPRRVOZBuA3ZClQnUsJAcYdxMM2CIrxe8LrT7M3imNtClTMGi22agDyBDQEpNEzAZDZD`,
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
