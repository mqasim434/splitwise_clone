import { Router } from "express";
import { addExpenceController } from "../controllers/expence.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/",authMiddleware,addExpenceController);

export default router;