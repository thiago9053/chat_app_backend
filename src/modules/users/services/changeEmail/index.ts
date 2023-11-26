import { userRepo } from "@modules/users/repos";
import { ChangeEmailService } from "./changeEmailService";
import { ChangeEmailController } from "@modules/users/services/changeEmail/changeEmailController";

const changeEmailService = new ChangeEmailService(userRepo);
const changeEmailController = new ChangeEmailController(changeEmailService);

export { changeEmailService, changeEmailController };
