// File: /api/login.js (Super Simple Test)

export default function handler(req, res) {
  // The ONLY thing this function does is print a message.
  console.log("--- SERVER FUNCTION IS RUNNING! ---");
  
  // Then it responds.
  res.status(200).json({ message: "Test successful" });
}
