import { Service } from "@shared/core/Service";
import { IUserRepo } from "../../repos/userRepo";
import { Result } from "@shared/core/Result";
import { LogoutDTO } from "./logoutDTO";
import { AppError } from "../../../../shared/core/AppError";
import { User } from "../../domain/user";
import { LogoutError } from "./logoutError";
import { left, right } from "@shared/core/types/Either";
import { LogoutResponse } from "./logoutResponse";
import { IAuthService } from "@modules/auth/redis/authService";

export class LogoutService implements Service<LogoutDTO, Promise<LogoutResponse>> {
	private userRepo: IUserRepo;
	private authService: IAuthService;

	constructor(userRepo: IUserRepo, authService: IAuthService) {
		this.userRepo = userRepo;
		this.authService = authService;
	}

	public async execute(request: LogoutDTO): Promise<LogoutResponse> {
		let user: User;
		const { userId } = request;

		try {
			try {
				user = (await this.userRepo.getUserByUserId?.(userId)) as User;
			} catch (err) {
				return left(new LogoutError.UserNotFoundOrDeletedError());
			}

			await this.authService.deAuthenticateUser(user.username.value);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
	}
}
