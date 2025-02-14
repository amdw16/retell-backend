// api/create-call.js

const axios = require('axios');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RETELL_API_KEY = process.env.RETELL_API_KEY;
  const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID;

  if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
    return res.status(500).json({ error: 'Missing Retell credentials' });
  }

  try {
    const retellResponse = await axios.post(
      'https://api.retellai.com/v1/create-web-call',
      { agent_id: RETELL_AGENT_ID },
      {
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = retellResponse.data;
    return res.status(200).json({
      success: true,
      accessToken: data.access_token,
      callId: data.call_id,
    });
  } catch (error) {
    console.error('Error creating web call:', error?.response?.data || error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create web call',
    });
  }
};