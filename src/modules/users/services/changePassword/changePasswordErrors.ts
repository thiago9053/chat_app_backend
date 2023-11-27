import { Result } from "@shared/core/Result";
import { ServiceError } from "@shared/core/ServiceError";

export namespace ChangePasswordErrors {
	export class UserDoesntExistError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "The user doesn't exist",
			} as ServiceError);
		}
	}

	export class SameAsOldPassword extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "The new password same as old password",
			} as ServiceError);
		}
	}
}
