import { Service } from "@shared/core/Service";
import { LoginDTO } from "./loginDTO";
import { LoginUseCaseErrors } from "./loginErrors";
import { LoginResponse, LoginDTOResponse } from "./loginResponse";
import { IUserRepo } from "../../repos/userRepo";
import { IAuthService } from "@modules/auth/redis/authService";
import { UserName } from "@modules/users/domain/userName";
import { UserPassword } from "@modules/users/domain/userPassword";
import { Result } from "@shared/core/Result";
import { AppError } from "@shared/core/AppError";
import { left, right } from "@shared/core/types/Either";
import { User } from "@modules/users/domain/user";
import { AccessToken, RefreshToken } from "@modules/users/domain/jwt";

export class LoginService implements Service<LoginDTO, Promise<LoginResponse>> {
	private userRepo: IUserRepo;
	private authService: IAuthService;

	constructor(userRepo: IUserRepo, authService: IAuthService) {
		this.userRepo = userRepo;
		this.authService = authService;
	}

	public async execute(request?: LoginDTO | undefined): Promise<LoginResponse> {
		let user: User;
		let userName: UserName;
		let password: UserPassword;

		try {
			const usernameOrError = UserName.create({ name: request?.username || "" });
			const passwordOrError = UserPassword.create({ value: request?.password || "" });
			const payloadResult = Result.combine([usernameOrError, passwordOrError]);

			if (!payloadResult.isSuccess) {
				return left(Result.fail<any>(payloadResult.getError()));
			}

			userName = usernameOrError.getValue();
			password = passwordOrError.getValue();

			user = (await this.userRepo.getUserByUserName(userName)) as User;
			const userFound = !!user;

			if (!userFound) {
				return left(new LoginUseCaseErrors.UserNameDoesntExistError());
			}

			const passwordValid = await user.password.comparePassword(password.value);

			if (!passwordValid) {
				return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
			}

			const accessToken: AccessToken = this.authService.signJWT({
				username: user?.username?.value,
				email: user?.email?.value,
				isEmailVerified: user.isEmailVerified,
				userId: user.userId.getStringValue(),
			});

			const refreshToken: RefreshToken = this.authService.createRefreshToken();

			user.setAccessToken(accessToken, refreshToken);

			await this.authService.saveAuthenticatedUser(user);

			return right(
				Result.ok<LoginDTOResponse>({
					accessToken,
					refreshToken,
				})
			);
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as LoginResponse;
		}
	}
}
