import { Result } from "@shared/core/Result";
import { CreateRequestErrors } from "./createRequestErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type CreateRequestResponse = Either<
	| CreateRequestErrors.UserDoesntExistError
	| CreateRequestErrors.RequestAlreadyExistsError
	| CreateRequestErrors.RequestingDoesntExistError
	| CreateRequestErrors.MessageInvalid
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
