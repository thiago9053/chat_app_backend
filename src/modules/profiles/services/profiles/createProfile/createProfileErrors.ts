import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace CreateProfileErrors {
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
				message: `Member for ${baseUserId} already exists.`,
			} as ServiceError);
		}
	}
}
