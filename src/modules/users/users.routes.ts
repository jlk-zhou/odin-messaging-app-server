import { Router } from "express";
import * as usersController from "./users.controller.ts";
import { validateUser } from "./middleware/verifyUser.ts";

const router = Router();

router.get("/:username", usersController.getUser);

router.post("/", validateUser, usersController.createUser);

export default router;
