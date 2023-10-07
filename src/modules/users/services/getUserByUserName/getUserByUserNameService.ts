import { GetUserByUserNameDTO } from "./getUserByUserNameDTO";
import { GetUserByUserNameError } from "./getUserByUserNameError";
import { Result } from "@shared/core/Result";
import { UserName } from "../../domain/userName";
import { IUserRepo } from "../../repos/userRepo";
import { AppError } from "../../../../shared/core/AppError";
import { User } from "../../domain/user";
import { left, right } from "@shared/core/types/Either";
import { Service } from "@shared/core/Service";
import { GetUserByUserNameResponse } from "./getUserByUserNameResponse";

export class GetUserByUserNameService implements Service<GetUserByUserNameDTO, Promise<GetUserByUserNameResponse>> {
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	public async execute(request: GetUserByUserNameDTO): Promise<GetUserByUserNameResponse> {
		try {
			const userNameOrError = UserName.create({ name: request.username });

			if (!userNameOrError.isSuccess) {
				return left(Result.fail<any>(userNameOrError.getError().toString())) as GetUserByUserNameResponse;
			}

			const userName: UserName = userNameOrError.getValue();

			const user = await this.userRepo.getUserByUserName(userName);
			const userFound = !!user === true;

			if (!userFound) {
				return left(new GetUserByUserNameError.UserNotFoundError(userName.value)) as GetUserByUserNameResponse;
			}

			return right(Result.ok<User>(user as User));
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
	}
}
