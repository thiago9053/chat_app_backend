import { Result } from "@shared/core/Result";
import { AddContactErrors } from "./addContactErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type AddContactResponse = Either<
	| AddContactErrors.CurrentProfileDoesntExistError
	| AddContactErrors.RequestDoesntExistsError
	| AddContactErrors.RequestingDoesntExistError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
