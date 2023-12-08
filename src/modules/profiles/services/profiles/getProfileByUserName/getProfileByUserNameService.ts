import { Service } from "@shared/core/Service";
import { GetProfileByUserNameDTO } from "./getProfileByUserNameDTO";
import { GetProfileByUserNameResponse } from "./getProfileByUserNameResponse";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { Profile } from "@modules/profiles/domain/profile";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { UserName } from "@modules/users/domain/userName";
import { GetProfileByUserNameError } from "./getProfileByUSerNameError";

export class GetProfileByUserNameService
	implements Service<GetProfileByUserNameDTO, Promise<GetProfileByUserNameResponse>>
{
	private profileRepo: IProfileRepo;
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo) {
		this.userRepo = userRepo;
		this.profileRepo = profileRepo;
	}

	public async execute(request: GetProfileByUserNameDTO): Promise<GetProfileByUserNameResponse> {
		try {
			const userNameOrError = UserName.create({ name: request.username });

			if (!userNameOrError.isSuccess) {
				return left(Result.fail<any>(userNameOrError.getError().toString())) as GetProfileByUserNameResponse;
			}

			const userName: UserName = userNameOrError.getValue();

			const user = await this.userRepo.getUserByUserName(userName);
			const userFound = !!user === true;

			if (!userFound) {
				return left(new GetProfileByUserNameError.UserNotFoundError(userName.value)) as GetProfileByUserNameResponse;
			}

			const userId = user.userId;

			const profile: Profile = await this.profileRepo.getProfileByUserId(userId);

			if (!profile) {
				return left(new GetProfileByUserNameError.ProfileNotFoundError(userName.value)) as GetProfileByUserNameResponse;
			}

			return right(Result.ok<Profile>(profile as Profile));
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as GetProfileByUserNameResponse;
		}
	}
}
