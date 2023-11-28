import { updateProfileController } from "@modules/profiles/services/updateProfile";
import { middleware } from "@shared/infra/middleware";
import express from "express";

const profileRouter = express.Router();

profileRouter.post("/update", middleware.ensureAuthenticated(), (req, res) =>
	updateProfileController.execute(req, res)
);

export { profileRouter };
