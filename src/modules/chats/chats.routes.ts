import { Router } from "express";
import * as chatsController from "./chats.controller.ts";
import verifySession from "../../middlewares/verifySession.ts";

const router = Router();

router.get("/:userId", verifySession, chatsController.getChats);

export default router;
