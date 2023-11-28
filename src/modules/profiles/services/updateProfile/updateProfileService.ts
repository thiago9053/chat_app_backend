import { UpdateProfileResponse } from "./updateProfileResponse";
import { UpdateProfileDTO } from "./updateProfileDTO";
import { Service } from "@shared/core/Service";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { User } from "@modules/users/domain/user";
import { UpdateProfileErrors } from "@modules/profiles/services/updateProfile/updateProfileError";
import { ProfileSignature } from "@modules/profiles/domain/profileSignature";
import { ProfilePhoneNumber } from "@modules/profiles/domain/profilePhoneNumber";
import { ProfileLocation } from "@modules/profiles/domain/profileLocation";

export class UpdateProfileService implements Service<UpdateProfileDTO, Promise<UpdateProfileResponse>> {
	private profileRepo: IProfileRepo;
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo) {
		this.profileRepo = profileRepo;
		this.userRepo = userRepo;
	}

	public async execute(request: UpdateProfileDTO): Promise<UpdateProfileResponse> {
		let user: User;
		const { userId, field, data } = request;
		try {
			try {
				user = (await this.userRepo.getUserByUserId(userId)) as User;
			} catch (error) {
				return left(new UpdateProfileErrors.UserDoesntExistError(userId));
			}
			switch (field) {
				case "signature": {
					const signatureOrError = ProfileSignature.create({ signature: data });
					if (!signatureOrError.isSuccess) {
						return left(Result.fail<void>(signatureOrError.getError().toString()));
					}
					await this.profileRepo.updateProfile(user.userId, field, signatureOrError.getValue().value);
					break;
				}
				case "phoneNumber": {
					const phoneNumberOrError = ProfilePhoneNumber.create({ phoneNumber: data });
					if (!phoneNumberOrError.isSuccess) {
						return left(Result.fail<void>(phoneNumberOrError.getError().toString()));
					}
					await this.profileRepo.updateProfile(user.userId, field, phoneNumberOrError.getValue().value);
					break;
				}
				case "location": {
					const locationOrError = ProfileLocation.create({ location: data });
					if (!locationOrError.isSuccess) {
						return left(Result.fail<void>(locationOrError.getError().toString()));
					}
					await this.profileRepo.updateProfile(user.userId, field, locationOrError.getValue().value);
					break;
				}
				default:
					return left(new UpdateProfileErrors.FieldDoesntExistsError(field));
			}
			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as UpdateProfileResponse;
		}
	}
}
