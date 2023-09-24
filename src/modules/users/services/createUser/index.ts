import { CreateUserService } from "./createUserService";
import { CreateUserController } from "./createUserController";
import { userRepo } from "@modules/users/repos";

const createUserService = new CreateUserService(userRepo);
const createUserController = new CreateUserController(createUserService);

export { createUserService, createUserController };
