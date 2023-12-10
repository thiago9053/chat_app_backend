import { middleware } from "@shared/infra/middleware";
import express from "express";
import { createRequestController } from "../services/requests/createRequest";
import { handleRequestController } from "../services/requests/handleRequest";

const requestRouter = express.Router();

requestRouter.post("/create", middleware.ensureAuthenticated(), (req, res) =>
	createRequestController.execute(req, res)
);

requestRouter.post("/update", middleware.ensureAuthenticated(), (req, res) =>
	handleRequestController.execute(req, res)
);

export { requestRouter };
