import { GetUserByUserNameService } from "./getUserByUserNameService";
import { GetUserByUserNameController } from "./getUserByUserNameController";
import { userRepo } from "../../repos";

export const getUserByUserNameService = new GetUserByUserNameService(userRepo);
export const getUserByUserNameController = new GetUserByUserNameController(getUserByUserNameService);
