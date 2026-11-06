import { Router } from "express";
import { addMembersToGroupController, getUserGroupsController, getGroupController, createGroupController } from "../controllers/groups.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createGroupSchema, addMembersSchema } from "../validations/group.validation";
import { getGroupExpencesController } from "../controllers/expence.controller";

const router = Router();

router.post("/",authMiddleware,validate(createGroupSchema),createGroupController);
router.post("/:id/members",authMiddleware,validate(addMembersSchema),addMembersToGroupController);
router.get("/",authMiddleware,getUserGroupsController);
router.get("/:id",authMiddleware,getGroupController);
router.get("/:id/expences", authMiddleware, getGroupExpencesController);

export default router;