import { profileRepo, requestRepo } from "@modules/profiles/repos";
import { HandleRequestService } from "./handleRequestService";
import { userRepo } from "@modules/users/repos";
import { HandleRequestController } from "./handleRequestController";

export const handleRequestService = new HandleRequestService(requestRepo, userRepo, profileRepo);
export const handleRequestController = new HandleRequestController(handleRequestService);
