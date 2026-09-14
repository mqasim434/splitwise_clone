import { Router, Response, Request } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" });
});

router.use("/auth",authRoutes);

export default router;