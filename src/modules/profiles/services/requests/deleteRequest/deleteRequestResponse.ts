import { Result } from "@shared/core/Result";
import { DeleteRequestErrors } from "./deleteRequestErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type DeleteRequestResponse = Either<
	DeleteRequestErrors.RequestDoesntExistError | AppError.UnexpectedError | Result<any>,
	Result<void>
>;
