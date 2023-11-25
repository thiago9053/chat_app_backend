export interface AppConfig {
	port: number;
	databaseUrl: string;
	secretKey: string;
	tokenExpiryTime: string;
	redisHost: string;
	redisPort: number;
	redisPassword: string;
}
