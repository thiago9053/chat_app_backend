import { Redis } from "ioredis";

export abstract class AbstractRedisClient {
	private tokenExpiryTime: number = 604800;
	protected redis: Redis;

	constructor(redis: Redis) {
		this.redis = redis;
	}

	public async count(key: string): Promise<number> {
		const allKeys = await this.getAllKeys(key);
		return allKeys.length;
	}

	public async exists(key: string): Promise<boolean> {
		const count = await this.count(key);
		return count >= 1;
	}

	public async getOne<T>(key: string): Promise<T> {
		const result = await this.redis.get(key);
		return <T>result;
	}

	public async getAllKeys(wildcard: string): Promise<string[]> {
		const keys = await this.redis.keys(wildcard);
		return keys;
	}

	public async getAllKeyValue(wildcard: string): Promise<any[]> {
		const keys: string[] = await this.redis.keys(wildcard);
		const allResults = await Promise.all(
			keys.map(async (key) => {
				const value = await this.getOne(key);
				return { key, value };
			})
		);

		return allResults;
	}

	public async set(key: string, value: any): Promise<any> {
		return this.redis.set(key, value, "EX", 3600);
	}

	public deleteOne(key: string): Promise<number> {
		return this.redis.del(key);
	}

	public testConnection(): Promise<any> {
		return this.redis.set("ping", "pong");
	}
}
