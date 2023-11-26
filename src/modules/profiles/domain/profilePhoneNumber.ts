import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";
import Joi from "joi";

interface PhoneNumberProps {
	phoneNumber: string;
}

export class ProfilePhoneNumber extends ValueObject<PhoneNumberProps> {
	public static minLength: number = 8;
	public static maxLength: number = 12;

	get value(): string {
		return this.props.phoneNumber;
	}

	private constructor(props: PhoneNumberProps) {
		super(props);
	}

	private static isValidPhoneNumber(phoneNumber: string) {
		const phoneNumberSchema = Joi.string().regex(/^[0-9]*$/);
		return phoneNumberSchema.validate(phoneNumber);
	}

	public static create(props: PhoneNumberProps): Result<ProfilePhoneNumber> {
		const emptyResult = Validate.againstEmpty(props.phoneNumber, "phoneNumber");
		if (!emptyResult.isSuccess) {
			return Result.fail<ProfilePhoneNumber>(emptyResult.getError());
		}

		const phoneNumberResult = Validate.againstNullOrUndefined(props.phoneNumber, "phoneNumber");
		if (!phoneNumberResult.isSuccess) {
			return Result.fail<ProfilePhoneNumber>(phoneNumberResult.getError());
		}

		const minLengthResult = Validate.againstAtLeast(this.minLength, props.phoneNumber);
		if (!minLengthResult.isSuccess) {
			return Result.fail<ProfilePhoneNumber>(minLengthResult.getError());
		}

		const maxLengthResult = Validate.againstAtMost(this.maxLength, props.phoneNumber);
		if (!maxLengthResult.isSuccess) {
			return Result.fail<ProfilePhoneNumber>(maxLengthResult.getError());
		}

		if (!this.isValidPhoneNumber(props.phoneNumber)) {
			return Result.fail<ProfilePhoneNumber>("Phone number is not valid");
		}

		return Result.ok<ProfilePhoneNumber>(new ProfilePhoneNumber(props));
	}
}
