import "dotenv/config"; // must stay first: it loads .env before app.ts reads the settings
import mongoose from "mongoose";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  // 1. database first, so we never accept requests we cannot serve
  await connectDB();

  // 2. then start listening
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // 3. shut down cleanly when Docker, systemd or Ctrl+C asks us to stop
  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("Shutdown complete");
      process.exit(0);
    });
    // safety net in case something refuses to close
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});