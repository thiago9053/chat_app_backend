import { ListRequestResponse } from "./listRequestResponse";
import { ListRequestDTO, ListRequestResponseDTO, RequestItem } from "./listRequestDTO";
import { Service } from "@shared/core/Service";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { IRequestRepo } from "@modules/profiles/repos/requestRepo";
import { User } from "@modules/users/domain/user";
import { left, right } from "@shared/core/types/Either";
import { Result } from "@shared/core/Result";
import { AppError } from "@shared/core/AppError";
import { ListRequestErrors } from "./listRequestErrors";
import { Request } from "@modules/profiles/domain/request";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { Profile } from "@modules/profiles/domain/profile";

export class ListRequestService implements Service<ListRequestDTO, Promise<ListRequestResponse>> {
	private userRepo: IUserRepo;
	private requestRepo: IRequestRepo;
	private profileRepo: IProfileRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo, requestRepo: IRequestRepo) {
		this.userRepo = userRepo;
		this.requestRepo = requestRepo;
		this.profileRepo = profileRepo;
	}

	public async execute(req: ListRequestDTO): Promise<ListRequestResponse> {
		let user: User;
		const { userId } = req;

		try {
			try {
				user = (await this.userRepo.getUserByUserId(userId)) as User;
				if (!user) {
					return left(new ListRequestErrors.UserDoesntExistError(userId));
				}
			} catch (error) {}

			const profile: Profile = await this.profileRepo.getProfileByUserId(userId);
			if (!profile) {
				return left(new ListRequestErrors.UserDoesntExistError(userId));
			}

			const listRequests: Request[] = await this.requestRepo.list(profile.profileId.getStringValue());

			const listRequestWithProfile = await this.profileRepo.getProfilesByProfileIds(
				listRequests.map((request) => request.requestedBy.getStringValue(), {
					avatarUrl: true,
					name: true,
					userId: true,
				})
			);

			const listRequestWithEmail = await this.userRepo.getUsers(
				listRequestWithProfile.map((request) => request.userId.getStringValue())
			);

			const requestItems: RequestItem[] = listRequestWithProfile.map((request) => ({
				avatarUrl: request.avatar,
				name: request.name.value,
				createdAt: listRequests?.find((_request) => _request.requestedBy.equals(request.profileId))?.createdAt,
				email: listRequestWithEmail?.find((_request) => _request.userId.equals(request.userId))?.email.value || "",
				message: listRequests?.find((_request) => _request.requestedBy.equals(request.profileId))?.message.value || "",
				requestId:
					listRequests
						?.find((_request) => _request.requestedBy.equals(request.profileId))
						?.requestId.getStringValue() || "",
			}));

			console.log(listRequests);

			return right(Result.ok<ListRequestResponseDTO>({ requestItems } as ListRequestResponseDTO));
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as ListRequestResponse;
		}
	}
}
