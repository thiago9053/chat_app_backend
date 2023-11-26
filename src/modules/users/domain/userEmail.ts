import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

export interface UserEmailProps {
	value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: UserEmailProps) {
		super(props);
	}

	private static isValidEmail(email: string) {
		const re = /^\S+@\S+\.\S+$/;
		return re.test(email);
	}

	private static format(email: string): string {
		return email?.trim().toLowerCase();
	}

	public static create(email: string): Result<UserEmail> {
		if (!this.isValidEmail(email)) {
			return Result.fail<UserEmail>("Email address is not valid");
		} else {
			return Result.ok<UserEmail>(new UserEmail({ value: this.format(email) }));
		}
	}
}
