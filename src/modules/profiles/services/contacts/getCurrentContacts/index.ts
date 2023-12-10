import { userRepo } from "@modules/users/repos";
import { GetCurrentContactsService } from "./getCurrentContactsService";
import { profileRepo } from "@modules/profiles/repos";
import { GetCurrentContactsController } from "./getCurrentContactsController";

export const getCurrentContactsService = new GetCurrentContactsService(userRepo, profileRepo);
export const getCurrentContactsController = new GetCurrentContactsController(getCurrentContactsService);
