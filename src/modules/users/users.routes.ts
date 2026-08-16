import { Router } from "express";
import * as usersController from "./users.controller.ts";
import verifySession from "../../middlewares/verifySession.ts";

const router = Router();

router.get("/:username", usersController.getUser);

export default router;
