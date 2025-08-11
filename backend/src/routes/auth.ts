// backend/src/routes/auth.ts
import express, { Request, Response } from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";
import db from "../db";

dotenv.config();

const router = express.Router();

router.get("/slack", (req: Request, res: Response) => {
    const params = querystring.stringify({
        client_id: process.env.SLACK_CLIENT_ID,
        scope: "chat:write,channels:read",
        redirect_uri: process.env.SLACK_REDIRECT_URI
    });

    res.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
});

router.get("/slack/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;

    if (!code) {
        return res.status(400).send("Missing 'code'");
    }

    try {
        const response = await axios.post(
            "https://slack.com/api/oauth.v2.access",
            querystring.stringify({
                code,
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                redirect_uri: process.env.SLACK_REDIRECT_URI
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );

        const data = response.data;

        if (!data.ok) {
            return res.status(400).json({ error: data.error });
        }

        const expiresIn = data.expires_in || 3600; // default 1 hour
        const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

        db.prepare(`
      INSERT OR REPLACE INTO tokens (team_id, access_token, refresh_token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(
            data.team.id,
            data.access_token,
            data.refresh_token || null,
            expiresAt
        );

        const redirectFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${redirectFrontendUrl}?team_id=${data.team.id}`);
    } catch (err) {
        console.error("OAuth error:", err);
        res.status(500).send("Error during Slack OAuth process.");
    }
});

export default router;
