import { FindProfileDTO, FindProfileResponseDTO } from "./findProfileDTO";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { FindProfileResponse } from "./findProfileResponse";
import { Service } from "@shared/core/Service";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";

export class FindProfileService implements Service<FindProfileDTO, Promise<FindProfileResponse>> {
	private profileRepo: IProfileRepo;

	constructor(profileRepo: IProfileRepo) {
		this.profileRepo = profileRepo;
	}

	public async execute(req: FindProfileDTO): Promise<FindProfileResponse> {
		const { keyword, userId } = req;

		try {
			const profileFound: any = await this.profileRepo.findByKeyword(keyword);
			const { profiles, users } = profileFound;

			const foundProfiles = profiles
				?.filter((profile: any) => profile.userId !== userId)
				?.map((profile: any) => ({
					avatarUrl: profile.avatarUrl || "",
					name: profile.name || "",
					signature: profile.signature || "",
					email: users?.find((user: any) => user.userId === profile.userId)?.email || "",
					profileId: profile.profileId,
				}));
			return right(Result.ok<FindProfileResponseDTO>({ foundProfiles } as FindProfileResponseDTO));
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as FindProfileResponse;
		}
	}
}
