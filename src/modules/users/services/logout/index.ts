import { LogoutService } from "@modules/users/services/logout/logoutService";
import { LogoutController } from "./logoutController";
import { userRepo } from "../../repos";
import { redisService } from "@modules/auth/redis";

export const logoutService = new LogoutService(userRepo, redisService);
export const logoutController = new LogoutController(logoutService);
