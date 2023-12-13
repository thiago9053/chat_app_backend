import { getCurrentContactsController } from "@modules/profiles/services/contacts/getCurrentContacts";
import { findProfileController } from "@modules/profiles/services/profiles/findProfile";
import { updateProfileController } from "@modules/profiles/services/profiles/updateProfile";
import { listRequestController } from "@modules/profiles/services/requests/listRequest";
import { middleware } from "@shared/infra/middleware";
import express from "express";

const profileRouter = express.Router();

profileRouter.post("/update", middleware.ensureAuthenticated(), (req, res) =>
	updateProfileController.execute(req, res)
);

profileRouter.get("/contacts", middleware.ensureAuthenticated(), (req, res) =>
	getCurrentContactsController.execute(req, res)
);

profileRouter.get("/contacts/list-requests", middleware.ensureAuthenticated(), (req, res) =>
	listRequestController.execute(req, res)
);

profileRouter.get("/list", (req, res) => findProfileController.execute(req, res));

export { profileRouter };
