import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace GetProfileByUserNameError {
	export class UserNotFoundError extends Result<ServiceError> {
		constructor(username: string) {
			super(false, {
				message: `No user with the username ${username} was found`,
			} as ServiceError);
		}
	}

	export class ProfileNotFoundError extends Result<ServiceError> {
		constructor(username: string) {
			super(false, {
				message: `No profile with the username ${username} was found`,
			} as ServiceError);
		}
	}
}
