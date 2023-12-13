import { CreateRequestResponse } from "./createRequestResponse";
import { CreateRequestDTO } from "./createRequestDTO";
import { Service } from "@shared/core/Service";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { User } from "@modules/users/domain/user";
import { Profile } from "@modules/profiles/domain/profile";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Request } from "@modules/profiles/domain/request";
import { IRequestRepo } from "@modules/profiles/repos/requestRepo";
import { ProfileId } from "@modules/profiles/domain/profileId";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CreateRequestErrors } from "./createRequestErrors";
import { RequestMessage } from "@modules/profiles/domain/requestMessage";

export class CreateRequestService implements Service<CreateRequestDTO, Promise<CreateRequestResponse>> {
	private profileRepo: IProfileRepo;
	private userRepo: IUserRepo;
	private requestRepo: IRequestRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo, requestRepo: IRequestRepo) {
		this.userRepo = userRepo;
		this.profileRepo = profileRepo;
		this.requestRepo = requestRepo;
	}

	public async execute(req: CreateRequestDTO): Promise<CreateRequestResponse> {
		let user: User;
		let profile: Profile;
		let request: Request;
		const { userId, requesting, message } = req;

		try {
			try {
				user = (await this.userRepo.getUserByUserId(userId)) as User;
			} catch (error) {
				return left(new CreateRequestErrors.UserDoesntExistError(userId));
			}

			try {
				profile = await this.profileRepo.getProfileByUserId(user.userId);
				const profileExists = !!profile === true;

				const isRequestingProfileExist = await this.profileRepo.exist(requesting);

				if (!isRequestingProfileExist) return left(new CreateRequestErrors.RequestingDoesntExistError(requesting));

				if (profileExists) {
					const isRequestExist = await this.requestRepo.exist(requesting, profile.profileId.getStringValue());
					if (isRequestExist) {
						return left(new CreateRequestErrors.RequestAlreadyExistsError());
					}

					const messageOrError = RequestMessage.create({ message });

					if (!messageOrError.isSuccess) {
						return left(new CreateRequestErrors.MessageInvalid());
					}

					const requestOrError: Result<Request> = Request.create({
						requestedBy: profile.profileId,
						requesting: ProfileId.create(new UniqueEntityID(requesting)).getValue(),
						createdAt: new Date(),
						status: "Pending",
						message: messageOrError.getValue(),
					});

					if (!requestOrError.isSuccess) {
						return left(requestOrError);
					}

					request = requestOrError.getValue();
					await this.requestRepo.create(request);
				}
			} catch (err) {}

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as CreateRequestResponse;
		}
	}
}
