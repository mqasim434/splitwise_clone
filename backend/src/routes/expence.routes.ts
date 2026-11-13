import { Router } from "express";
import { addExpenseController } from "../controllers/expense.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/",authMiddleware,addExpenseController);

export default router;