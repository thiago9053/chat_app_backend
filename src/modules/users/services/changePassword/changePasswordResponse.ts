import { Result } from "@shared/core/Result";
import { ChangePasswordErrors } from "./changePasswordErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type ChangePasswordResponse = Either<
	ChangePasswordErrors.SameAsOldPassword | AppError.UnexpectedError | Result<any>,
	Result<void>
>;
