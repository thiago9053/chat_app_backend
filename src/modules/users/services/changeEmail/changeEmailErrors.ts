import { Result } from "@shared/core/Result";
import { ServiceError } from "@shared/core/ServiceError";

export namespace ChangeEmailErrors {
	export class UserDoesntExistError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "The user doesn't exist",
			} as ServiceError);
		}
	}

	export class SameEmail extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "The new email is sames as old one",
			} as ServiceError);
		}
	}
}
