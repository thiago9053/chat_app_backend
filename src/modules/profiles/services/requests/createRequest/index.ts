import { userRepo } from "@modules/users/repos";
import { CreateRequestService } from "./createRequestService";
import { profileRepo, requestRepo } from "@modules/profiles/repos";
import { CreateRequestController } from "./createRequestController";

export const createRequestService = new CreateRequestService(userRepo, profileRepo, requestRepo);
export const createRequestController = new CreateRequestController(createRequestService);
