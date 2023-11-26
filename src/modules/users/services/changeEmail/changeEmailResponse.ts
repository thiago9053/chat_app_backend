import { Result } from "@shared/core/Result";
import { ChangeEmailErrors } from "./changeEmailErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type ChangeEmailResponse = Either<
	ChangeEmailErrors.UserDoesntExistError | ChangeEmailErrors.SameEmail | AppError.UnexpectedError | Result<any>,
	Result<void>
>;
