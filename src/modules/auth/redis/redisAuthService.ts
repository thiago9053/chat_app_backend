import { Redis } from "ioredis";
import * as jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "@config/config";
import { AbstractRedisClient } from "./abstractRedis";
import { IAuthService } from "./authService";
import { RefreshToken, JWTToken, JWTClaims } from "../domain/jwt";
import { User } from "@modules/users/domain/user";

export class RedisAuthService extends AbstractRedisClient implements IAuthService {
	public jwtHashName: string = "activeJwtClients";

	constructor(redis: Redis) {
		super(redis);
	}

	public async refreshTokenExists(refreshToken: RefreshToken): Promise<boolean> {
		const keys = await this.getAllKeys(`*${refreshToken}*`);
		return keys.length !== 0;
	}

	public async getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string> {
		const keys = await this.getAllKeys(`*${refreshToken}*`);
		const exists = keys.length !== 0;

		if (!exists) throw new Error("Username not found for refresh token.");

		const key = keys[0];

		return key.substring(key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1);
	}

	public async saveAuthenticatedUser(user: User): Promise<void> {
		if (user.isLoggedIn()) {
			await this.addToken(user.username.value, user.refreshToken, user.accessToken);
		}
	}

	public async deAuthenticateUser(username: string): Promise<void> {
		await this.clearAllSessions(username);
	}

	public createRefreshToken(): RefreshToken {
		return crypto.randomBytes(256).toString("hex");
	}

	public signJWT(props: JWTClaims): JWTToken {
		const claims: JWTClaims = {
			email: props.email,
			username: props.username,
			userId: props.userId,
			isEmailVerified: props.isEmailVerified,
		};

		return jwt.sign(claims, config.secretKey, {
			expiresIn: config.tokenExpiryTime,
		});
	}

	public async decodeJWT(token: string): Promise<JWTClaims> {
		return new Promise((resolve, reject) => {
			jwt.verify(token, config.secretKey, (err, decoded) => {
				if (err) return reject(null);
				return resolve(decoded as JWTClaims);
			});
		});
	}

	private constructKey(username: string, refreshToken: RefreshToken): string {
		return `refresh-${refreshToken}.${this.jwtHashName}.${username}`;
	}

	public addToken(username: string, refreshToken: RefreshToken, token: JWTToken): Promise<any> {
		return this.set(this.constructKey(username, refreshToken), token);
	}

	public async clearAllTokens(): Promise<any> {
		const allKeys = await this.getAllKeys(`*${this.jwtHashName}*`);
		return Promise.all(allKeys.map((key) => this.deleteOne(key)));
	}

	public countSessions(username: string): Promise<number> {
		return this.count(`*${this.jwtHashName}.${username}`);
	}

	public countTokens(): Promise<number> {
		return this.count(`*${this.jwtHashName}*`);
	}

	public async getTokens(username: string): Promise<string[]> {
		const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${username}`);
		return keyValues.map((kv) => kv.value);
	}

	public async getToken(username: string, refreshToken: string): Promise<string> {
		return this.getOne(this.constructKey(username, refreshToken));
	}

	public async clearToken(username: string, refreshToken: string): Promise<any> {
		return this.deleteOne(this.constructKey(username, refreshToken));
	}

	public async clearAllSessions(username: string): Promise<any> {
		const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${username}`);
		const keys = keyValues.map((kv) => kv.key);
		return Promise.all(keys.map((key) => this.deleteOne(key)));
	}

	public async sessionExists(username: string, refreshToken: string): Promise<boolean> {
		const token = await this.getToken(username, refreshToken);
		if (!!token) {
			return true;
		} else {
			return false;
		}
	}
}
