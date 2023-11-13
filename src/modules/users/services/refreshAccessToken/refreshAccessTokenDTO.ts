import { RefreshToken } from "@modules/auth/domain/jwt";

export interface RefreshAccessTokenDTO {
	refreshToken: RefreshToken;
}
