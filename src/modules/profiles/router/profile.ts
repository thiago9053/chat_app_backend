import { addContactController } from "@modules/profiles/services/contacts/addContact";
import { updateProfileController } from "@modules/profiles/services/profiles/updateProfile";
import { middleware } from "@shared/infra/middleware";
import express from "express";

const profileRouter = express.Router();

profileRouter.post("/update", middleware.ensureAuthenticated(), (req, res) =>
	updateProfileController.execute(req, res)
);

profileRouter.post("/contact", middleware.ensureAuthenticated(), (req, res) => addContactController.execute(req, res));

export { profileRouter };
