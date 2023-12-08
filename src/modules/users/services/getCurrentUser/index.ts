import { GetCurrentUserController } from "./getCurrentUserController";
import { getUserByUserNameService } from "../getUserByUserName";
import { getProfileByUserNameService } from "@modules/profiles/services/profiles/getProfileByUserName";

const getCurrentUserController = new GetCurrentUserController(getUserByUserNameService, getProfileByUserNameService);

export { getCurrentUserController };
