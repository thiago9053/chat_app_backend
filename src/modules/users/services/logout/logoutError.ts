import { Result } from "@shared/core/Result";
import { ServiceError } from "@shared/core/ServiceError";

export namespace LogoutError {
	export class UserNotFoundOrDeletedError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "User not found or doesn't exist anymore.",
			} as ServiceError);
		}
	}
}
