import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace RefreshAccessTokenErrors {
	export class RefreshTokenNotFound extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "Refresh token doesn't exist",
			} as ServiceError);
		}
	}

	export class UserNotFoundOrDeletedError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "User not found or doesn't exist anymore.",
			} as ServiceError);
		}
	}
}
