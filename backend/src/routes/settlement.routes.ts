import { Router } from "express";
import { addSettlementController } from "../controllers/settlement.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/",authMiddleware,addSettlementController);
router.get("/",authMiddleware,addSettlementController);

export default router;