import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace LoginUseCaseErrors {
	export class UserNameDoesntExistError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "Username or password incorrect.",
			} as ServiceError);
		}
	}

	export class PasswordDoesntMatchError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "Password doesnt match error.",
			} as ServiceError);
		}
	}
}
