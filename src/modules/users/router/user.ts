import { createUserController } from "@modules/users/services/createUser";
import express from "express";

const userRouter = express.Router();

userRouter.post("/", (req, res) => createUserController.execute(req, res));

export { userRouter };
