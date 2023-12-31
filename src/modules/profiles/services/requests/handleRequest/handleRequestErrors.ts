import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace HandleRequestErrors {
	export class RequestDoesntExistError extends Result<ServiceError> {
		constructor(requestId: string) {
			super(false, {
				message: `The request: ${requestId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class UserDoesntExistError extends Result<ServiceError> {
		constructor(baseUserId: string) {
			super(false, {
				message: `A user for user id ${baseUserId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class DontHavePermission extends Result<ServiceError> {
		constructor(requestId: string) {
			super(false, {
				message: `You dont have permisson to handle request: ${requestId}.`,
			} as ServiceError);
		}
	}

	export class RequestStatusInvalid extends Result<ServiceError> {
		constructor(status: string) {
			super(false, {
				message: `The status ${status} is not valid`,
			} as ServiceError);
		}
	}

	export class RequestAlreadyHandled extends Result<ServiceError> {
		constructor(requestId: string) {
			super(false, {
				message: `The request: ${requestId} is already handled`,
			} as ServiceError);
		}
	}
}
