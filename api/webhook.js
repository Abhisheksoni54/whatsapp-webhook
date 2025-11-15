import fetch from "node-fetch";

const VERIFY_TOKEN = "my_test_token"; // Change if you want a stronger token
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/0db6783f-4d4c-4e41-8909-0709fa9a7177/webhook"; // Your n8n webhook URL

export default async function handler(req, res) {
  // WhatsApp webhook verification
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed");
    }
  }

  // WhatsApp incoming messages
  if (req.method === "POST") {
    const body = req.body;
    console.log("Received message from WhatsApp:", body);

    // Forward the message to your local n8n workflow
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log("Forwarded to n8n:", response.status);
    } catch (err) {
      console.error("Error forwarding to n8n:", err.message);
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  res.status(404).send("Not Found");
}
