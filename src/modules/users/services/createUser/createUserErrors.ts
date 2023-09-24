import { Result } from "@shared/core/Result";
import { ServiceError } from "@shared/core/ServiceError";

export namespace CreateUserErrors {
	export class EmailAlreadyExistsError extends Result<ServiceError> {
		constructor(email: string) {
			super(false, {
				message: `The email ${email} associated for this account already exists`,
			} as ServiceError);
		}
	}

	export class UsernameTakenError extends Result<ServiceError> {
		constructor(username: string) {
			super(false, {
				message: `The username ${username} was already taken`,
			} as ServiceError);
		}
	}
}
