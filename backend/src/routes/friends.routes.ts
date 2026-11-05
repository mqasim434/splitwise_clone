import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addFriendController, getFriendsController } from "../controllers/friend.controller";

const router = Router();

router.post('/',authMiddleware,addFriendController);
router.get('/',authMiddleware,getFriendsController);

export default router;