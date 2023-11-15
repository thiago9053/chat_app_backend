import { User } from "@modules/users/domain/user";
import { UserEmail } from "@modules/users/domain/userEmail";
import { UserName } from "@modules/users/domain/userName";
import { UserPassword } from "@modules/users/domain/userPassword";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { CreateUserDTO } from "@modules/users/services/createUser/createUserDTO";
import { CreateUserErrors } from "@modules/users/services/createUser/createUserErrors";
import { CreateUserResponse } from "@modules/users/services/createUser/createUserResponse";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Service } from "@shared/core/Service";
import { left, right } from "@shared/core/types/Either";

export class CreateUserService implements Service<CreateUserDTO, Promise<CreateUserResponse>> {
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	async execute(request?: CreateUserDTO | undefined): Promise<CreateUserResponse> {
		const emailOrError = UserEmail.create(request?.email as string);
		const passwordOrError = UserPassword.create({ value: request?.password as string });
		const usernameOrError = UserName.create({ name: request?.username as string });

		const dtoResult = Result.combine([emailOrError, passwordOrError, usernameOrError]);

		if (!dtoResult.isSuccess) {
			return left(Result.fail<void>(dtoResult.getError())) as CreateUserResponse;
		}

		const email: UserEmail = emailOrError.getValue();
		const password: UserPassword = passwordOrError.getValue();
		const username: UserName = usernameOrError.getValue();

		try {
			const userAlreadyExists = await this.userRepo.exist(email);
			if (userAlreadyExists) {
				return left(new CreateUserErrors.EmailAlreadyExistsError(email.value)) as CreateUserResponse;
			}
			try {
				const alreadyCreatedUserByUserName = await this.userRepo.getUserByUserName(username);

				const userNameTaken = !!alreadyCreatedUserByUserName === true;

				if (userNameTaken) {
					return left(new CreateUserErrors.UsernameTakenError(username.value)) as CreateUserResponse;
				}
			} catch (error) {}

			const userOrError: Result<User> = User.create({
				email,
				password,
				username,
			});

			if (!userOrError.isSuccess) {
				return left(Result.fail<User>(userOrError.getError().toString())) as CreateUserResponse;
			}

			const user: User = userOrError.getValue();

			await this.userRepo.create(user);

			return right(Result.ok<void>());
		} catch (error) {
			return left(new AppError.UnexpectedError(error)) as CreateUserResponse;
		}
	}
}
