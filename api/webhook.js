export default function handler(req, res) {
  if (req.method === "GET") {
    // Facebook webhook verification
    return res.status(200).send(req.query["hub.challenge"]);
  }

  if (req.method === "POST") {
    // Handle messages
    console.log("Received:", req.body);
    return res.status(200).send("EVENT_RECEIVED");
  }

  res.status(404).send("Not Found");
}

