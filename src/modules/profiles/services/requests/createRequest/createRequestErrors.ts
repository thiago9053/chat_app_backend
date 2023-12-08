import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace CreateRequestErrors {
	export class UserDoesntExistError extends Result<ServiceError> {
		constructor(baseUserId: string) {
			super(false, {
				message: `A user for user id ${baseUserId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class RequestingDoesntExistError extends Result<ServiceError> {
		constructor(profileId: string) {
			super(false, {
				message: `The user you are requesting: ${profileId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class RequestAlreadyExistsError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "Request already exists.",
			} as ServiceError);
		}
	}
}
