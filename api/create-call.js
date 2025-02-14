// api/create-call.js
import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests to avoid accidentally exposing the endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read these secrets from environment variables on Vercel
  // We'll set them in the Vercel dashboard soon
  const RETELL_API_KEY = process.env.RETELL_API_KEY;
  const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID;

  // If for some reason your environment variables didn't load
  if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
    return res.status(500).json({ error: 'Missing Retell credentials' });
  }

  try {
    // Call Retell's create-web-call endpoint
    const retellResponse = await axios.post(
      'https://api.retellai.com/v1/create-web-call',
      {
        agent_id: RETELL_AGENT_ID, // supply your agent id
      },
      {
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Retell should return an access token and a call id
    const data = retellResponse.data;

    // Return it to the client
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
}