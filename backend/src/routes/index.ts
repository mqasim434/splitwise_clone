import { Router, Response, Request } from "express";
import authRoutes from "./auth.routes";
import groupsRoutes from "./groups.routes";
import friendsRoutes from "./friends.routes";
import expeneceRoutes from "./expence.routes";
import settlementRoutes from "./settlement.routes";
import mongoose from "mongoose";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({
        message: dbUp ? "Server is running" : "Database unavailable",
        status: dbUp ? "ok" : "degraded",
        db: dbUp ? "up" : "down",
        uptime: Math.round(process.uptime()),
    });
});

router.use("/auth",authRoutes);
router.use("/groups",groupsRoutes);
router.use("/friends",friendsRoutes);
router.use("/expense",expeneceRoutes);
router.use("/settlement",settlementRoutes);

export default router;