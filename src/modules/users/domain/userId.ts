import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { ValueObject } from "@shared/domain/ValueObject";

export class UserId extends ValueObject<{ value: UniqueEntityID }> {
	private constructor(value: UniqueEntityID) {
		super({ value });
	}

	getStringValue(): string {
		return this.props.value.toString();
	}

	getValue(): UniqueEntityID {
		return this.props.value;
	}

	public static create(value: UniqueEntityID): Result<UserId> {
		let guardResult = Validate.againstNullOrUndefined(value, "value");
		if (!guardResult.isSuccess) {
			return Result.fail<UserId>(guardResult.getError());
		}
		return Result.ok<UserId>(new UserId(value));
	}
}
