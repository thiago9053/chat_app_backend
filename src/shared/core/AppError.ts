import { Result } from "./Result";
import { ServiceError } from "./ServiceError";

export namespace AppError {
	export class UnexpectedError extends Result<ServiceError> {
		public constructor(err: any) {
			super(false, {
				message: "An unexpected error occurred.",
				error: err.message,
			} as ServiceError);
			console.log("[AppError]: An unexpected error occurred");
			console.error(err);
		}

		public static create(err: any): UnexpectedError {
			return new UnexpectedError(err);
		}
	}
}
