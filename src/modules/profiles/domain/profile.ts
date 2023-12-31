import { AggregateRoot } from "@shared/domain/AggregateRoot";
import { ProfileSignature } from "./profileSignature";
import { ProfileId } from "./profileId";
import { ProfilePhoneNumber } from "./profilePhoneNumber";
import { UserId } from "@modules/users/domain/userId";
import { ProfileLocation } from "./profileLocation";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ProfileName } from "./profileName";

interface ProfileProps {
	signature: ProfileSignature;
	phoneNumber: ProfilePhoneNumber;
	userId: UserId;
	location: ProfileLocation;
	name: ProfileName;
	avatar: string;
	coverImage: string;
	contactIds?: string[];
	totalContacts?: number;
}

export class Profile extends AggregateRoot<ProfileProps> {
	private constructor(props: ProfileProps, id?: UniqueEntityID) {
		super(props, id);
	}

	get profileId(): ProfileId {
		return ProfileId.create(this._id).getValue();
	}

	get signature(): ProfileSignature {
		return this.props.signature;
	}

	get phoneNumber(): ProfilePhoneNumber {
		return this.props.phoneNumber;
	}

	get userId(): UserId {
		return this.props.userId;
	}

	get location(): ProfileLocation {
		return this.props.location;
	}

	get avatar(): string {
		return this.props.avatar;
	}

	get coverImage(): string {
		return this.props.coverImage;
	}

	get name(): ProfileName {
		return this.props.name;
	}

	get contactIds(): string[] | undefined {
		return this.props.contactIds;
	}

	public static create(props: ProfileProps, id?: UniqueEntityID): Result<Profile> {
		const validateResult = Validate.againstNullOrUndefined(props.userId, "userId");

		if (!validateResult.isSuccess) {
			return Result.fail<Profile>(validateResult.getError());
		}
		const profile = new Profile({ ...props }, id);
		return Result.ok<Profile>(profile);
	}
}
