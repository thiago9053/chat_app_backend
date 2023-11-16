import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { IAuthService } from "@modules/auth/redis/authService";
import { Response, NextFunction } from "express";

export class Middleware {
	private authService: IAuthService;

	constructor(authService: IAuthService) {
		this.authService = authService;
	}

	private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
		return res.status(status).send({ message });
	}

	public includeDecodedTokenIfExists() {
		return async (req: DecodedExpressRequest, res: Response, next: NextFunction) => {
			const token = req.headers["authorization"];
			// Confirm that the token was signed with our signature.
			if (token) {
				const decoded = this.authService.decodeJWT(token);
				const signatureFailed = !decoded;

				if (signatureFailed) {
					return this.endRequest(403, "Token signature expired.", res);
				}

				// See if the token was found
				const { username } = decoded;
				const tokens = await this.authService.getTokens(username);

				// if the token was found, just continue the request.
				if (tokens.length !== 0) {
					req.decoded = decoded;
					return next();
				} else {
					return next();
				}
			} else {
				return next();
			}
		};
	}

	public ensureAuthenticated() {
		return async (req: any, res: Response, next: NextFunction) => {
			const token = req.headers["authorization"];
			// Confirm that the token was signed with our signature.
			if (token) {
				const decoded = this.authService.decodeJWT(token);
				console.log("51", decoded);
				const signatureFailed = !decoded;

				if (signatureFailed) {
					return this.endRequest(403, "Token signature expired or invalid.", res);
				}

				// See if the token was found
				const { username } = decoded;
				const tokens = await this.authService.getTokens(username);
				console.log(tokens, username);
				// if the token was found, just continue the request.
				if (tokens.length !== 0) {
					req.decoded = decoded;
					return next();
				} else {
					return this.endRequest(403, "Auth token not found. User is probably not logged in. Please login again.", res);
				}
			} else {
				return this.endRequest(403, "No access token provided", res);
			}
		};
	}
}
