export interface JWTClaims {
	userId: string;
	isEmailVerified: boolean;
	email: string;
	username: string;
	adminUser: boolean;
}

export type AccessToken = string;

export type SessionId = string;

export type RefreshToken = string;
