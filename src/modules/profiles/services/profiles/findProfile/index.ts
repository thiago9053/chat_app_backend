import { profileRepo } from "@modules/profiles/repos";
import { FindProfileService } from "./findProfileService";
import { FindProfileController } from "./findProfileController";

export const findProfileService = new FindProfileService(profileRepo);
export const findProfileController = new FindProfileController(findProfileService);
