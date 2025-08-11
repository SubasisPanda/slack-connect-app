// backend/src/index.ts
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import slackRoutes from "./routes/slack";
import scheduleRoutes from "./routes/schedule";
import manageScheduleRoutes from "./routes/manageSchedule";

import "./scheduler"; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);
app.use("/", slackRoutes);
app.use("/", scheduleRoutes);
app.use("/", manageScheduleRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
