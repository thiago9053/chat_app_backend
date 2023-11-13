import { userRepo } from "@modules/users/repos";
import { RefreshAccessTokenService } from "./refreshAccessTokenService";
import { redisService } from "@modules/auth/redis";
import { RefreshAccessTokenController } from "@modules/users/services/refreshAccessToken/refreshAccessTokenController";

export const refreshAccessTokenService = new RefreshAccessTokenService(userRepo, redisService);

export const refreshAccessTokenController = new RefreshAccessTokenController(refreshAccessTokenService);
