import { userRepo } from "@modules/users/repos";
import { CreateProfileService } from "./createProfileService";
import { profileRepo } from "@modules/profiles/repos";

const createProfileService = new CreateProfileService(userRepo, profileRepo);

export { createProfileService };
