import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface NameProps {
	name: string;
}

export class ProfileName extends ValueObject<NameProps> {
	public static maxLength: number = 20;

	get value(): string {
		return this.props.name;
	}

	private constructor(props: NameProps) {
		super(props);
	}

	public static create(props: NameProps): Result<ProfileName> {
		const maxLengthResult = Validate.againstAtMost(this.maxLength, props.name);
		if (!maxLengthResult.isSuccess) {
			return Result.fail<ProfileName>(maxLengthResult.getError());
		}

		return Result.ok<ProfileName>(new ProfileName(props));
	}
}
