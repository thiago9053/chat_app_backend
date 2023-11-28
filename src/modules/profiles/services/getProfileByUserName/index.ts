import { userRepo } from "@modules/users/repos";
import { GetProfileByUserNameService } from "./getProfileByUserNameService";
import { profileRepo } from "@modules/profiles/repos";

const getProfileByUserNameService = new GetProfileByUserNameService(userRepo, profileRepo);

export { getProfileByUserNameService };
