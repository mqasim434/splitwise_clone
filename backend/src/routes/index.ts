import { Router, Response, Request } from "express";
import authRoutes from "./auth.routes";
import groupsRoutes from "./groups.routes";
import friendsRoutes from "./friends.routes";
import expeneceRoutes from "./expence.routes";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" });
});

router.use("/auth",authRoutes);
router.use("/groups",groupsRoutes);
router.use("/friends",friendsRoutes);
router.use("/expence",expeneceRoutes);

export default router;