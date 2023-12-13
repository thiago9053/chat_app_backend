import { userRepo } from "@modules/users/repos";
import { ListRequestService } from "./listRequestService";
import { profileRepo, requestRepo } from "@modules/profiles/repos";
import { ListRequestController } from "./listRequestController";

export const listRequestService = new ListRequestService(userRepo, profileRepo, requestRepo);
export const listRequestController = new ListRequestController(listRequestService);
