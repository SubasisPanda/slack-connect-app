// backend/src/scheduler.ts
import cron from "node-cron";
import db from "./db";
import { getValidAccessToken } from "./slackAuth";
import { postMessage } from "./slackApi";

// Define row type
interface ScheduledMessageRow {
  id: number;
  team_id: string;
  channel: string;
  text: string;
  send_at: number;
  sent: number;
}

cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking for scheduled messages...");

  const now = Math.floor(Date.now() / 1000);

  // Cast the results so TS knows the shape
  const rows = db.prepare("SELECT * FROM scheduled_messages WHERE sent = 0 AND send_at <= ?")
    .all(now) as ScheduledMessageRow[];

  for (const msg of rows) {
    try {
      const token = await getValidAccessToken(msg.team_id);
      if (!token) {
        console.warn(`No valid token for team ${msg.team_id}`);
        continue;
      }

      const result = await postMessage(token, msg.channel, msg.text);
      if (result.ok) {
        db.prepare(`UPDATE scheduled_messages SET sent = 1 WHERE id = ?`).run(msg.id);
        console.log(`✅ Message sent to channel ${msg.channel}`);
      } else {
        console.error(`❌ Failed to send message: ${result.error}`);
      }
    } catch (err) {
      console.error("Error sending scheduled message:", err);
    }
  }
});
