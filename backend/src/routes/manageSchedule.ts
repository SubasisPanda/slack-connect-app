// backend/src/routes/manageSchedule.ts
import express, { Request, Response } from "express";
import db from "../db";

// Define row type
interface ScheduledMessageRow {
  id: number;
  team_id: string;
  channel: string;
  text: string;
  send_at: number;
  sent: number;
}

const router = express.Router();

/**
 * GET /message/scheduled
 * Query: team_id
 * Returns all unsent scheduled messages for a team
 */
router.get("/message/scheduled", (req: Request, res: Response) => {
  const team_id = req.query.team_id as string;
  if (!team_id) return res.status(400).json({ error: "Missing team_id" });

  const rows = db
    .prepare("SELECT * FROM scheduled_messages WHERE team_id = ? AND sent = 0")
    .all(team_id) as ScheduledMessageRow[];

  res.json({ scheduled: rows });
});

/**
 * DELETE /message/cancel/:id
 * Cancels a scheduled message by marking it as sent=1 (won't be processed)
 */
router.delete("/message/cancel/:id", (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!idParam) return res.status(400).json({ error: "Missing message ID" });

  const id = parseInt(idParam, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid message ID" });

  const result = db
    .prepare("UPDATE scheduled_messages SET sent = 1 WHERE id = ? AND sent = 0")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Message not found or already sent" });
  }

  res.json({ success: true, message: "Message canceled successfully" });
});


export default router;
