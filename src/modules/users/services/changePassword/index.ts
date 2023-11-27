import { userRepo } from "@modules/users/repos";
import { ChangePasswordService } from "./changePasswordService";
import { ChangePasswordController } from "./changePasswordController";

const changePasswordService = new ChangePasswordService(userRepo);
const changePasswordController = new ChangePasswordController(changePasswordService);

export { changePasswordService, changePasswordController };
