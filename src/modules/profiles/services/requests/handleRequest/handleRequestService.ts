import { HandleRequestResponse } from "./handleRequestResponse";
import { HandleRequestDTO } from "./handleRequestDTO";
import { Service } from "@shared/core/Service";
import { IRequestRepo } from "@modules/profiles/repos/requestRepo";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Request } from "@modules/profiles/domain/request";
import { HandleRequestErrors } from "./handleRequestErrors";
import { User } from "@modules/users/domain/user";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { Profile } from "@modules/profiles/domain/profile";

export class HandleRequestService implements Service<HandleRequestDTO, Promise<HandleRequestResponse>> {
	private requestRepo: IRequestRepo;
	private userRepo: IUserRepo;
	private profileRepo: IProfileRepo;

	constructor(requestRepo: IRequestRepo, userRepo: IUserRepo, profileRepo: IProfileRepo) {
		this.requestRepo = requestRepo;
		this.userRepo = userRepo;
		this.profileRepo = profileRepo;
	}

	public async execute(req: HandleRequestDTO): Promise<HandleRequestResponse> {
		let request: Request;
		let user: User;
		let profile: Profile;
		const { status, requestId, userId } = req;
		try {
			try {
				user = (await this.userRepo.getUserByUserId(userId)) as User;
				if (!user) {
					return left(new HandleRequestErrors.UserDoesntExistError(userId));
				}
			} catch (error) {}

			try {
				request = await this.requestRepo.getRequestByRequetsId(requestId);
				if (!request) {
					return left(new HandleRequestErrors.RequestDoesntExistError(requestId));
				}
			} catch (error) {
				return left(new HandleRequestErrors.RequestDoesntExistError(requestId));
			}

			try {
				profile = (await this.profileRepo.getProfileByUserId(userId)) as Profile;
				if (!profile) {
					return left(new HandleRequestErrors.UserDoesntExistError(userId));
				}
				if (
					profile.profileId.getStringValue() !== request.requesting.getStringValue() &&
					profile.profileId.getStringValue() !== request.requestedBy.getStringValue()
				) {
					return left(new HandleRequestErrors.DontHavePermission(requestId));
				}
			} catch (error) {}

			const currentStatus = request.status;

			if (currentStatus !== "Pending") {
				return left(new HandleRequestErrors.RequestAlreadyHandled(request.requestId.getStringValue()));
			}

			if (status !== "Accepted" && status !== "Rejected") {
				return left(new HandleRequestErrors.RequestStatusInvalid(status));
			} else if (status === "Accepted") {
				request.acceptRequest();
			} else if (status === "Rejected") {
				request.rejectRequest();
			}
			await this.requestRepo.updateRequest(requestId, status);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as HandleRequestResponse;
		}
	}
}
