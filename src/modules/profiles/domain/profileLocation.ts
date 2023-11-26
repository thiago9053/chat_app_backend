import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface LocationProps {
	location: string;
}

export class ProfileLocation extends ValueObject<LocationProps> {
	public static maxLength: number = 200;

	get value(): string {
		return this.props.location;
	}

	private constructor(props: LocationProps) {
		super(props);
	}

	public static create(props: LocationProps): Result<ProfileLocation> {
		const emptyResult = Validate.againstEmpty(props.location, "location");
		if (!emptyResult.isSuccess) {
			return Result.fail<ProfileLocation>(emptyResult.getError());
		}

		const locationResult = Validate.againstNullOrUndefined(props.location, "location");
		if (!locationResult.isSuccess) {
			return Result.fail<ProfileLocation>(locationResult.getError());
		}

		const maxLengthResult = Validate.againstAtMost(this.maxLength, props.location);
		if (!maxLengthResult.isSuccess) {
			return Result.fail<ProfileLocation>(maxLengthResult.getError());
		}

		return Result.ok<ProfileLocation>(new ProfileLocation(props));
	}
}
