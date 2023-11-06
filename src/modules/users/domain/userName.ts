import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface UserNameProps {
	name: string;
}

export class UserName extends ValueObject<UserNameProps> {
	public static maxLength: number = 15;
	public static minLength: number = 2;

	get value(): string {
		return this.props.name;
	}

	private constructor(props: UserNameProps) {
		super(props);
	}

	public static create(props: UserNameProps): Result<UserName> {
		const emptyResult = Validate.againstEmpty(props.name, "username");
		if (!emptyResult.isSuccess) {
			return Result.fail<UserName>(emptyResult.getError());
		}

		const usernameResult = Validate.againstNullOrUndefined(props.name, "username");
		if (!usernameResult.isSuccess) {
			return Result.fail<UserName>(usernameResult.getError());
		}

		const minLengthResult = Validate.againstAtLeast(this.minLength, props.name);
		if (!minLengthResult.isSuccess) {
			return Result.fail<UserName>(minLengthResult.getError());
		}

		const maxLengthResult = Validate.againstAtMost(this.maxLength, props.name);
		if (!maxLengthResult.isSuccess) {
			return Result.fail<UserName>(minLengthResult.getError());
		}

		return Result.ok<UserName>(new UserName(props));
	}
}
