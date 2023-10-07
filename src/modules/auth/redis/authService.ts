import { User } from "@modules/users/domain/user";
import { AccessToken, JWTClaims, RefreshToken } from "../domain/jwt";

export interface IAuthService {
	signJWT(props: JWTClaims): AccessToken;
	decodeJWT(token: string): JWTClaims;
	createRefreshToken(): RefreshToken;
	getTokens(username: string): Promise<string[]>;
	saveAuthenticatedUser(user: User): Promise<void>;
	deAuthenticateUser(username: string): Promise<void>;
	refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
	getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
}
