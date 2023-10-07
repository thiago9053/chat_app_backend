import { redisService } from "@modules/auth/redis";
import { Middleware } from "./middleware";

const middleware = new Middleware(redisService);

export { middleware };
