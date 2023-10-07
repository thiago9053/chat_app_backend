import { LoginController } from "@modules/users/services/login/loginController";
import { redisService } from "@modules/auth/redis";
import { LoginService } from "./loginService";
import { userRepo } from "../../repos";

const loginService = new LoginService(userRepo, redisService);

const loginController = new LoginController(loginService);

export { loginController, loginService };
