// backend/src/routes/slack.ts
import express, { Request, Response } from "express";
import { getValidAccessToken } from "../slackAuth";
import { fetchChannels, postMessage } from "../slackApi";

const router = express.Router();

/**
 * GET /channels
 * Lists all channels for the connected Slack workspace
 * Query param: team_id
 */
router.get("/channels", async (req: Request, res: Response) => {
  const team_id = req.query.team_id as string;
  if (!team_id) return res.status(400).json({ error: "Missing team_id" });

  const token = await getValidAccessToken(team_id);
  if (!token) return res.status(401).json({ error: "No valid token found" });

  try {
    const data = await fetchChannels(token);
    if (!data.ok) return res.status(400).json({ error: data.error });

    res.json({ channels: data.channels });
  } catch (err) {
    console.error("Error fetching channels:", err);
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

/**
 * POST /message/send
 * Sends a message immediately to a Slack channel
 * Body: { team_id, channel, text }
 */
router.post("/message/send", async (req: Request, res: Response) => {
  const { team_id, channel, text } = req.body;
  if (!team_id || !channel || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const token = await getValidAccessToken(team_id);
  if (!token) return res.status(401).json({ error: "No valid token found" });

  try {
    const data = await postMessage(token, channel, text);
    if (!data.ok) return res.status(400).json({ error: data.error });

    res.json({ success: true, message: data.message });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
