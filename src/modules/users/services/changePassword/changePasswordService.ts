import { ChangePasswordDTO } from "./changePasswordDTO";
import { ChangePasswordResponse } from "./changePasswordResponse";
import { Service } from "@shared/core/Service";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { UserPassword } from "@modules/users/domain/userPassword";
import { Result } from "@shared/core/Result";
import { ChangePasswordErrors } from "./changePasswordErrors";
import { User } from "@modules/users/domain/user";

export class ChangePasswordService implements Service<ChangePasswordDTO, Promise<ChangePasswordResponse>> {
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	async execute(request?: ChangePasswordDTO | undefined): Promise<ChangePasswordResponse> {
		const passwordOrError = UserPassword.create({ value: request?.newPassword as string });
		if (!passwordOrError.isSuccess) {
			return left(Result.fail<any>(passwordOrError.getError().toString())) as ChangePasswordResponse;
		}
		try {
			const password = passwordOrError.getValue();
			const user: User = (await this.userRepo.getUserByUserId(request?.userId as string)) as User;
			const userFound = !!user;

			if (!userFound) {
				return left(new ChangePasswordErrors.UserDoesntExistError());
			}

			const passwordSame = await user.password.comparePassword(password.value);

			if (passwordSame) {
				return left(new ChangePasswordErrors.SameAsOldPassword());
			}
			const hashedPassword = await password.getHashedValue();
			await this.userRepo.updatePassword(request?.userId as string, hashedPassword);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as ChangePasswordResponse;
		}
	}
}
