// backend/src/slackAuth.ts
import axios from "axios";
import querystring from "querystring";
import db from "./db";
import dotenv from "dotenv";

dotenv.config();
// backend/src/slackAuth.ts
interface TokenRow {
  team_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

export async function getValidAccessToken(team_id: string): Promise<string | null> {
  const row = db
    .prepare("SELECT * FROM tokens WHERE team_id = ?")
    .get(team_id) as TokenRow | undefined;

  if (!row) return null;

  const now = Math.floor(Date.now() / 1000);
  if (row.expires_at > now + 60) {
    return row.access_token; // still valid
  }

  if (!row.refresh_token) {
    console.warn("No refresh token, cannot refresh.");
    return null;
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: row.refresh_token,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    const data = response.data;
    if (!data.ok) {
      console.error("Refresh failed:", data.error);
      return null;
    }

    const expiresIn = data.expires_in || 3600;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    db.prepare(
      `UPDATE tokens
       SET access_token = ?, refresh_token = ?, expires_at = ?
       WHERE team_id = ?`
    ).run(
      data.access_token,
      data.refresh_token || row.refresh_token,
      expiresAt,
      team_id
    );

    return data.access_token;
  } catch (err) {
    console.error("Token refresh error:", err);
    return null;
  }
}
