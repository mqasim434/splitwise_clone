import { Router } from "express";
import { addMembersToGroupController, getUserGroupsController, getGroupController, createGroupController } from "../controllers/groups.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createGroupSchema, addMembersSchema } from "../validations/group.validation";
import { getGroupExpensesController } from "../controllers/expense.controller";
import { getGroupBalancesController } from "../controllers/balances.controller";
import { getGroupActivityController } from "../controllers/groups.controller";

const router = Router();

router.post("/",authMiddleware,validate(createGroupSchema),createGroupController);
router.post("/:id/members",authMiddleware,validate(addMembersSchema),addMembersToGroupController);
router.get("/",authMiddleware,getUserGroupsController);
router.get("/:id",authMiddleware,getGroupController);
router.get("/:id/expenses", authMiddleware, getGroupExpensesController);
router.get("/:id/balances",authMiddleware,getGroupBalancesController);
router.get("/:id/activity",authMiddleware,getGroupActivityController);

export default router;