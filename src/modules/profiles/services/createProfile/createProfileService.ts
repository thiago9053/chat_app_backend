import { CreateProfileResponse } from "@modules/profiles/services/createProfile/createProfileResponse";
import { CreateProfileDTO } from "./createProfileDTO";
import { Service } from "@shared/core/Service";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { User } from "@modules/users/domain/user";
import { Profile } from "@modules/profiles/domain/profile";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { CreateProfileErrors } from "@modules/profiles/services/createProfile/createProfileErrors";
import { ProfileSignature } from "@modules/profiles/domain/profileSignature";
import { ProfilePhoneNumber } from "@modules/profiles/domain/profilePhoneNumber";
import { ProfileLocation } from "@modules/profiles/domain/profileLocation";
import { ProfileName } from "@modules/profiles/domain/profileName";

export class CreateProfileService implements Service<CreateProfileDTO, Promise<CreateProfileResponse>> {
	private profileRepo: IProfileRepo;
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo) {
		this.userRepo = userRepo;
		this.profileRepo = profileRepo;
	}

	public async execute(request: CreateProfileDTO): Promise<CreateProfileResponse> {
		let user: User;
		let profile: Profile;
		const { userId } = request;

		try {
			try {
				user = (await this.userRepo.getUserByUserId(userId)) as User;
			} catch (error) {
				return left(new CreateProfileErrors.UserDoesntExistError(userId));
			}

			try {
				profile = await this.profileRepo.getProfileByUserId(userId);
				const profileExists = !!profile === true;

				if (profileExists) {
					return left(new CreateProfileErrors.ProfileAlreadyExistsError(userId));
				}
			} catch (err) {}

			const signatureOrError = ProfileSignature.create({ signature: "" });
			const phoneNumberOrError = ProfilePhoneNumber.create({ phoneNumber: "00000000" });
			const locationOrError = ProfileLocation.create({ location: "" });
			const nameOrError = ProfileName.create({ name: "" });

			const payloadResult = Result.combine([signatureOrError, phoneNumberOrError, locationOrError]);

			if (!payloadResult.isSuccess) {
				return left(Result.fail<void>(payloadResult.getError())) as CreateProfileResponse;
			}

			const profileOrError: Result<Profile> = Profile.create({
				userId: user.userId,
				signature: signatureOrError.getValue(),
				phoneNumber: phoneNumberOrError.getValue(),
				location: locationOrError.getValue(),
				avatar: "",
				coverImage: "",
				name: nameOrError.getValue(),
			});

			if (!profileOrError.isSuccess) {
				return left(profileOrError);
			}

			profile = profileOrError.getValue();
			await this.profileRepo.create(profile);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as CreateProfileResponse;
		}
	}
}
