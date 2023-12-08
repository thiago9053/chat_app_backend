import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { ValueObject } from "@shared/domain/ValueObject";

export class RequestId extends ValueObject<{ value: UniqueEntityID }> {
	private constructor(value: UniqueEntityID) {
		super({ value });
	}

	getStringValue(): string {
		return this.props.value.toString();
	}

	getValue(): UniqueEntityID {
		return this.props.value;
	}

	public static create(value: UniqueEntityID): Result<RequestId> {
		let guardResult = Validate.againstNullOrUndefined(value, "value");
		if (!guardResult.isSuccess) {
			return Result.fail<RequestId>(guardResult.getError());
		}
		return Result.ok<RequestId>(new RequestId(value));
	}
}
