// backend/src/routes/schedule.ts
import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

/**
 * POST /message/schedule
 * Body: { team_id, channel, text, send_at (ISO string) }
 */
router.post("/message/schedule", (req: Request, res: Response) => {
  const { team_id, channel, text, send_at } = req.body;

  if (!team_id || !channel || !text || !send_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sendTimestamp = Math.floor(new Date(send_at).getTime() / 1000);
  if (isNaN(sendTimestamp)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  db.prepare(`
    INSERT INTO scheduled_messages (team_id, channel, text, send_at)
    VALUES (?, ?, ?, ?)
  `).run(team_id, channel, text, sendTimestamp);

  res.json({ success: true, message: "Message scheduled successfully" });
});

export default router;
