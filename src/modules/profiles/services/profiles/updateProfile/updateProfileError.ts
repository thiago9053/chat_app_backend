import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace UpdateProfileErrors {
	export class UserDoesntExistError extends Result<ServiceError> {
		constructor(baseUserId: string) {
			super(false, {
				message: `A user for user id ${baseUserId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class ProfileAlreadyExistsError extends Result<ServiceError> {
		constructor(baseUserId: string) {
			super(false, {
				message: `Profile for ${baseUserId} already exists.`,
			} as ServiceError);
		}
	}

	export class PhoneNumberAlreadyExistsError extends Result<ServiceError> {
		constructor(phoneNumber: string) {
			super(false, {
				message: `Phone number: ${phoneNumber} already exists. Please use another one.`,
			} as ServiceError);
		}
	}

	export class FieldDoesntExistsError extends Result<ServiceError> {
		constructor(field: string) {
			super(false, {
				message: `Field ${field} doesn't exist`,
			} as ServiceError);
		}
	}
}
