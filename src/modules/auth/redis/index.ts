import { RedisAuthService } from "./redisAuthService";
import { redis } from "./redisConnection";

export const redisService = new RedisAuthService(redis);
