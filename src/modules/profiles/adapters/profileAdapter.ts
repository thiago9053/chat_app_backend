import { Profile } from "@modules/profiles/domain/profile";
import { ProfileLocation } from "@modules/profiles/domain/profileLocation";
import { ProfilePhoneNumber } from "@modules/profiles/domain/profilePhoneNumber";
import { ProfileSignature } from "@modules/profiles/domain/profileSignature";
import { UserId } from "@modules/users/domain/userId";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { ProfileDTO } from "@modules/profiles/dtos/profileDTO";
import { ProfileName } from "@modules/profiles/domain/profileName";

export class ProfileAdapter {
	public static toDTO(profile: Profile): ProfileDTO {
		return {
			location: profile.location.value,
			signature: profile.signature.value,
			phoneNumner: profile.phoneNumber.value,
			avatarUrl: profile.avatar,
			coverImageUrl: profile.coverImage,
			name: profile.name.value,
		};
	}

	public static toDomain(raw: any): Profile {
		const userIdOrError = UserId.create(new UniqueEntityID(raw.userId));
		const signatureOrError = ProfileSignature.create({ signature: raw.signature });
		const phoneNumberOrError = ProfilePhoneNumber.create({ phoneNumber: raw.phoneNumber });
		const locationOrError = ProfileLocation.create({ location: raw.location });
		const nameOrError = ProfileName.create({ name: raw.name });

		const profileOrError = Profile.create(
			{
				userId: userIdOrError.getValue(),
				signature: signatureOrError.getValue(),
				phoneNumber: phoneNumberOrError.getValue(),
				location: locationOrError.getValue(),
				avatar: raw.avatarUrl,
				coverImage: raw.coverImageUrl,
				name: nameOrError.getValue(),
				contactIds: raw.contactIds,
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
			name: profile.name.value,
			avatarUrl: profile.avatar,
			coverImageUrl: profile.coverImage,
			contactIds: profile.contactIds,
		};
	}
}
