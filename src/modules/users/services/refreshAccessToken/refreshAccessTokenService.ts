import { RefreshAccessTokenDTO } from "./refreshAccessTokenDTO";
import { RefreshAccessTokenResponse } from "./refreshAccessTokenResponse";
import { Service } from "@shared/core/Service";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { IAuthService } from "@modules/auth/redis/authService";
import { User } from "@modules/users/domain/user";
import { left, right } from "@shared/core/types/Either";
import { RefreshAccessTokenErrors } from "./refreshAccessTokenErrors";
import { AccessToken } from "@modules/auth/domain/jwt";
import { Result } from "@shared/core/Result";
import { AppError } from "@shared/core/AppError";

export class RefreshAccessTokenService implements Service<RefreshAccessTokenDTO, Promise<RefreshAccessTokenResponse>> {
	private userRepo: IUserRepo;
	private authService: IAuthService;

	constructor(userRepo: IUserRepo, authService: IAuthService) {
		this.userRepo = userRepo;
		this.authService = authService;
	}

	public async execute(req: RefreshAccessTokenDTO): Promise<RefreshAccessTokenResponse> {
		const { refreshToken } = req;
		let user: User;
		let username: string;

		try {
			// Get the username for the user that owns the refresh token
			try {
				username = await this.authService.getUserNameFromRefreshToken(refreshToken);
			} catch (err) {
				return left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
			}

			try {
				// get the user by username
				user = await this.userRepo.getUserByUserName(username);
			} catch (err) {
				return left(new RefreshAccessTokenErrors.UserNotFoundOrDeletedError());
			}

			const accessToken: AccessToken = this.authService.signJWT({
				username: user.username.value,
				email: user.email.value,
				isEmailVerified: user.isEmailVerified,
				userId: user.userId.getStringValue(),
			});

			// sign a new jwt for that user
			user.setAccessToken(accessToken, refreshToken);

			// save it
			await this.authService.saveAuthenticatedUser(user);

			// return the new access token
			return right(Result.ok<AccessToken>(accessToken));
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
	}
}
