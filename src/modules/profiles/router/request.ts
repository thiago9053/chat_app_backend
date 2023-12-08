import { middleware } from "@shared/infra/middleware";
import express from "express";
import { createRequestController } from "../services/requests/createRequest";

const requestRouter = express.Router();

requestRouter.post("/create", middleware.ensureAuthenticated(), (req, res) =>
	createRequestController.execute(req, res)
);

export { requestRouter };
