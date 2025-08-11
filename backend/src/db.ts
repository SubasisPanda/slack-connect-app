// backend/src/db.ts
import Database, { Database as DatabaseType } from "better-sqlite3";

const db: DatabaseType = new Database("data.db");

db.exec(`
CREATE TABLE IF NOT EXISTS tokens (
    team_id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at INTEGER
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS scheduled_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    text TEXT NOT NULL,
    send_at INTEGER NOT NULL,
    sent INTEGER DEFAULT 0
);
`);

export default db;
