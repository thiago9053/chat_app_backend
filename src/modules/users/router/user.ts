import { changeEmailController } from "@modules/users/services/changeEmail";
import { createUserController } from "@modules/users/services/createUser";
import { getCurrentUserController } from "@modules/users/services/getCurrentUser";
import { getUserByUserNameController } from "@modules/users/services/getUserByUserName";
import { loginController } from "@modules/users/services/login";
import { logoutController } from "@modules/users/services/logout";
import { refreshAccessTokenController } from "@modules/users/services/refreshAccessToken";

import { middleware } from "@shared/infra/middleware";
import express from "express";

const userRouter = express.Router();

userRouter.post("/create", (req, res) => createUserController.execute(req, res));

userRouter.post("/login", (req, res) => loginController.execute(req, res));

userRouter.post("/logout", middleware.ensureAuthenticated(), (req, res) => logoutController.execute(req, res));

userRouter.get("/user", middleware.ensureAuthenticated(), (req, res) => getUserByUserNameController.execute(req, res));

userRouter.get("/me", middleware.ensureAuthenticated(), (req, res) => getCurrentUserController.execute(req, res));

userRouter.post("/token/refresh", (req, res) => refreshAccessTokenController.execute(req, res));

userRouter.post("/email/update", middleware.ensureAuthenticated(), (req, res) =>
	changeEmailController.execute(req, res)
);

export { userRouter };
