import { ValueObject } from "@shared/domain/ValueObject";
import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import argon2 from "argon2";

export interface IUserPasswordProps {
	value: string;
	hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
	public static minLength: number = 6;

	get value(): string {
		return this.props.value;
	}

	private constructor(props: IUserPasswordProps) {
		super(props);
	}

	private static isAppropriateLength(password: string): boolean {
		return password.length >= this.minLength;
	}

	/**
	 * @method comparePassword
	 * @desc Compares as plain-text and hashed password.
	 */

	public async comparePassword(plainTextPassword: string): Promise<boolean> {
		let hashed: string;
		if (this.isAlreadyHashed()) {
			hashed = this.props.value;
			return await this.argon2Compare(plainTextPassword, hashed);
		} else {
			return this.props.value === plainTextPassword;
		}
	}

	private async argon2Compare(plainText: string, hashed: string): Promise<boolean> {
		try {
			return await argon2.verify(hashed, plainText);
		} catch (e: unknown) {
			return false;
		}
	}

	public isAlreadyHashed(): boolean {
		return this.props.hashed as boolean;
	}

	private async hashPassword(password: string): Promise<string> {
		try {
			return await argon2.hash(password);
		} catch (e: unknown) {
			if (typeof e === "string") {
				return e;
			} else if (e instanceof Error) {
				return e.message;
			}
			return "Error occurs when hash password";
		}
	}

	public getHashedValue(): Promise<string> {
		return new Promise((resolve) => {
			if (this.isAlreadyHashed()) {
				return resolve(this.props.value);
			} else {
				return resolve(this.hashPassword(this.props.value));
			}
		});
	}

	public static create(props: IUserPasswordProps): Result<UserPassword> {
		const propsResult = Validate.againstNullOrUndefined(props.value, "password");

		if (!propsResult.isSuccess) {
			return Result.fail<UserPassword>(propsResult.getError());
		} else {
			if (!props.hashed) {
				if (!this.isAppropriateLength(props.value)) {
					return Result.fail<UserPassword>("Password doesnt meet criteria [8 chars min].");
				}
			}

			return Result.ok<UserPassword>(
				new UserPassword({
					value: props.value,
					hashed: !!props.hashed,
				})
			);
		}
	}
}
