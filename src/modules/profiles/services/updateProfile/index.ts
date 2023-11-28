import { userRepo } from "@modules/users/repos";
import { UpdateProfileService } from "./updateProfileService";
import { profileRepo } from "@modules/profiles/repos";
import { UpdateProfileController } from "@modules/profiles/services/updateProfile/updateProfileController";

export const updateProfileService = new UpdateProfileService(userRepo, profileRepo);
export const updateProfileController = new UpdateProfileController(updateProfileService);
