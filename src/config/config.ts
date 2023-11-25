import { AppConfig } from "./interface";

const { DATABASE_URL, PORT, SECRET_KEY, TOKEN_EXPIRY_TIME, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

export const config = {
	port: PORT || 1211,
	databaseUrl: DATABASE_URL,
	secretKey: SECRET_KEY,
	tokenExpiryTime: TOKEN_EXPIRY_TIME || "1h",
	redisHost: REDIS_HOST || "",
	redisPort: REDIS_PORT || 6379,
	redisPassword: REDIS_PASSWORD || "",
} as AppConfig;
