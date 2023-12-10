import { Result } from "@shared/core/Result";
import { HandleRequestErrors } from "./handleRequestErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type HandleRequestResponse = Either<
	| HandleRequestErrors.RequestDoesntExistError
	| HandleRequestErrors.RequestStatusInvalid
	| HandleRequestErrors.UserDoesntExistError
	| HandleRequestErrors.RequestAlreadyHandled
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
