import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace GetUserByUserNameError {
	export class UserNotFoundError extends Result<ServiceError> {
		constructor(username: string) {
			super(false, {
				message: `No user with the username ${username} was found`,
			} as ServiceError);
		}
	}
}
