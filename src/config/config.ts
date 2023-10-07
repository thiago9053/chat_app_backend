import { AppConfig } from "./interface";

const { DATABASE_URL, PORT, SECRET_KEY, TOKEN_EXPIRY_TIME } = process.env;

export const config = {
	port: PORT || 1211,
	databaseUrl: DATABASE_URL,
	secretKey: SECRET_KEY,
	tokenExpiryTime: TOKEN_EXPIRY_TIME || "1h",
} as AppConfig;
