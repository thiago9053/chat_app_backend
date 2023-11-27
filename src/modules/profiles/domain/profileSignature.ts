import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface SignatureProps {
	signature: string;
}

export class ProfileSignature extends ValueObject<SignatureProps> {
	public static maxLength: number = 1000;

	get value(): string {
		return this.props.signature;
	}

	private constructor(props: SignatureProps) {
		super(props);
	}

	public static create(props: SignatureProps): Result<ProfileSignature> {
		const maxLengthResult = Validate.againstAtMost(this.maxLength, props.signature);
		if (!maxLengthResult.isSuccess) {
			return Result.fail<ProfileSignature>(maxLengthResult.getError());
		}

		return Result.ok<ProfileSignature>(new ProfileSignature(props));
	}
}
