import { Service } from "@shared/core/Service";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { GetCurrentContactsResponseDTO, GetCurrentContactsDTO } from "./getCurrentContactsDTO";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { GetCurrentContactsResponse } from "./getCurrentContactsResponse";
import { GetCurrentContactsErrors } from "./getCurrentContactsErrors";
import { User } from "@modules/users/domain/user";
import { Result } from "@shared/core/Result";

export class GetCurrentContactsService implements Service<GetCurrentContactsDTO, Promise<GetCurrentContactsResponse>> {
	private userRepo: IUserRepo;
	private profileRepo: IProfileRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo) {
		this.userRepo = userRepo;
		this.profileRepo = profileRepo;
	}

	public async execute(request: GetCurrentContactsDTO): Promise<GetCurrentContactsResponse> {
		let user: User;
		const { userId } = request;
		try {
			try {
				user = (await this.userRepo.getUserByUserId(userId)) as User;
				if (!user) {
					return left(new GetCurrentContactsErrors.UserDoesntExistError(userId));
				}
			} catch (error) {}

			const contactsRaw: any = await this.profileRepo.getContacts(userId);
			const { profiles, users } = contactsRaw;

			const contacts = profiles.map((profile: any) => ({
				location: profile.location || "",
				phoneNumber: profile.phoneNumber || "",
				signature: profile.signature || "",
				avatarUrl: profile.avatarUrl || "",
				coverImageUrl: profile.coverImageUrl || "",
				name: profile.name || "",
				email: users?.find((user: any) => user.userId === profile.userId)?.email || "",
				lastLogin: users?.find((user: any) => user.userId === profile.userId)?.lastLogin || new Date(),
				username: users?.find((user: any) => user.userId === profile.userId)?.username || "",
			}));

			return right(Result.ok<GetCurrentContactsResponseDTO>({ contacts } as GetCurrentContactsResponseDTO));
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as GetCurrentContactsResponse;
		}
	}
}
