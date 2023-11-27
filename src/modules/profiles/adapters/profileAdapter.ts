import { Profile } from "@modules/profiles/domain/profile";
import { ProfileLocation } from "@modules/profiles/domain/profileLocation";
import { ProfilePhoneNumber } from "@modules/profiles/domain/profilePhoneNumber";
import { ProfileSignature } from "@modules/profiles/domain/profileSignature";
import { UserId } from "@modules/users/domain/userId";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";

export class ProfileAdapter {
	public static toDomain(raw: any): Profile {
		const userIdOrError = UserId.create(new UniqueEntityID(raw.userId));
		const signatureOrError = ProfileSignature.create(raw.signature);
		const phoneNumberOrError = ProfilePhoneNumber.create(raw.phoneNumber);
		const locationOrError = ProfileLocation.create(raw.location);

		const profileOrError = Profile.create(
			{
				userId: userIdOrError.getValue(),
				signature: signatureOrError.getValue(),
				phoneNumber: phoneNumberOrError.getValue(),
				location: locationOrError.getValue(),
			},
			new UniqueEntityID(raw.profileId)
		);

		!profileOrError.isSuccess ? console.log(profileOrError.getError()) : "";

		return profileOrError.getValue();
	}

	static async toPersistence(profile: Profile): Promise<any> {
		return {
			profileId: profile.profileId.getStringValue(),
			userId: profile.userId.getStringValue(),
			signature: profile.signature.value,
			phoneNumber: profile.phoneNumber.value,
			location: profile.location.value,
		};
	}
}
