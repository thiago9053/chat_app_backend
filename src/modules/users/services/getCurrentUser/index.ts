import { GetCurrentUserController } from "./getCurrentUserController";
import { getUserByUserNameService } from "../getUserByUserName";

const getCurrentUserController = new GetCurrentUserController(getUserByUserNameService);

export { getCurrentUserController };
