Slack Connect App
A full-stack web application that connects to Slack, sends messages instantly, and schedules messages for future delivery.
Built with React (TypeScript), Node.js (Express + TypeScript), and SQLite.

Features
🔐 Secure Slack OAuth 2.0 connection with token storage

🔄 Automatic token refresh for uninterrupted service

💬 Send messages instantly to Slack channels

⏰ Schedule messages for a future date & time

📋 View & cancel scheduled messages before sending

Tech Stack
Frontend: React, TypeScript, Axios, Day.js
Backend: Node.js, Express, TypeScript, SQLite (better-sqlite3), Axios, Node-Cron
Database: SQLite (file-based)
OAuth Provider: Slack API

Architecture Overview
1. OAuth Flow
User clicks "Connect Slack" → redirected to Slack’s auth page (/auth/slack)

Slack redirects back to /auth/slack/callback with a code

Backend exchanges code for access_token (and optionally refresh_token)

Tokens stored in SQLite with team_id, expires_at

Backend redirects to frontend with team_id in query params

2. Token Management
Helper getValidAccessToken(team_id) checks if token is valid

If expired and refresh_token is available → refreshes via Slack API

Updated token stored in DB automatically

3. Message Sending
/channels → lists available channels for connected workspace

/message/send → sends instantly via Slack chat.postMessage API

4. Scheduling
/message/schedule → saves message + send time in scheduled_messages table

Background node-cron job runs every minute:

Finds due messages

Gets valid token

Sends message

Marks as sent

5. Scheduled Message Management
/message/scheduled → lists all unsent scheduled messages for a team

/message/cancel/:id → cancels message before sending

Folder Structure
bash
Copy
Edit
slack-connect-app/
│
├── backend/
│   ├── src/
│   │   ├── routes/       # Express routes (auth, slack, schedule, manage)
│   │   ├── scheduler.ts  # Background cron job
│   │   ├── slackApi.ts   # Slack API wrappers
│   │   ├── slackAuth.ts  # Token validation & refresh
│   │   ├── db.ts         # SQLite DB setup
│   │   └── index.ts      # App entry
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── api.ts        # Axios instance
│   │   └── App.tsx
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
Setup Instructions
1. Clone Repo
bash
Copy
Edit
git clone https://github.com/your-username/slack-connect-app.git
cd slack-connect-app
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create .env:

ini
Copy
Edit
SLACK_CLIENT_ID=your_client_id
SLACK_CLIENT_SECRET=your_client_secret
SLACK_REDIRECT_URI=http://localhost:5000/auth/slack/callback
FRONTEND_URL=http://localhost:3000
PORT=5000
Run backend:

bash
Copy
Edit
npm run dev
3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
Create .env:

ini
Copy
Edit
REACT_APP_BACKEND_URL=http://localhost:5000
Run frontend:

bash
Copy
Edit
npm start
4. Slack App Setup
Go to Slack API Apps → Create New App

Redirect URL: http://localhost:5000/auth/slack/callback

Scopes (OAuth & Permissions → Bot Token Scopes):

chat:write

channels:read

Install App to Workspace

Usage
Open frontend → click Connect Slack

Approve permissions → redirected back with your workspace connected

Select a channel → send message now or schedule

View scheduled messages → cancel if needed

Challenges & Learnings
Challenges
Handling Slack OAuth with both access_token and refresh_token

Keeping tokens valid without requiring re-login

Making cron jobs reliable in dev mode

Coordinating frontend & backend OAuth flow

Learnings
Deepened understanding of OAuth 2.0 in real-world apps

SQLite as a quick persistent store for tokens/messages

Integrating cron-based schedulers in Node.js

Coordinating cross-origin requests between React & Express