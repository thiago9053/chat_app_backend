import { ChangeEmailDTO } from "@modules/users/services/changeEmail/changeEmailDTO";
import { ChangeEmailResponse } from "@modules/users/services/changeEmail/changeEmailResponse";
import { Service } from "@shared/core/Service";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { UserEmail } from "@modules/users/domain/userEmail";
import { AppError } from "@shared/core/AppError";
import { left, right } from "@shared/core/types/Either";
import { Result } from "@shared/core/Result";
import { User } from "@modules/users/domain/user";
import { ChangeEmailErrors } from "@modules/users/services/changeEmail/changeEmailErrors";

export class ChangeEmailService implements Service<ChangeEmailDTO, Promise<ChangeEmailResponse>> {
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	async execute(request?: ChangeEmailDTO | undefined): Promise<ChangeEmailResponse> {
		let email: UserEmail;
		let userId: string | undefined;

		try {
			const emailOrError = UserEmail.create(request?.email as string);
			userId = request?.userId;

			const dtoResult = Result.combine([emailOrError]);
			if (!dtoResult.isSuccess) {
				return left(Result.fail<void>(dtoResult.getError())) as ChangeEmailResponse;
			}

			email = emailOrError.getValue();

			const user: User = (await this.userRepo.getUserByUserId(userId as string)) as User;
			const userFound = !!user;

			if (!userFound) {
				return left(new ChangeEmailErrors.UserDoesntExistError());
			}

			const oldEmail: UserEmail = user.email;

			const isSameEmail = oldEmail.equals(email);

			if (isSameEmail) {
				return left(new ChangeEmailErrors.SameEmail());
			}

			await this.userRepo.updateEmail(userId as string, email);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as ChangeEmailResponse;
		}
	}
}
