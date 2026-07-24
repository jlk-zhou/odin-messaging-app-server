import { Router } from "express";
import * as messagesController from "./messages.controller.ts"; 

const router = Router();

router.get("/", messagesController.getAllMessages);
router.get("/:messageId", messagesController.getMessage);

export default router;
