import { Redis } from "ioredis";
import { config } from "@config/config";

const { redisHost, redisPassword, redisPort } = config;

const redis = new Redis({
	password: redisPassword,
	host: redisHost,
	port: redisPort,
});

export { redis };
