import { Result } from "@shared/core/Result";
import { CreateProfileErrors } from "./createProfileErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type CreateProfileResponse = Either<
	| CreateProfileErrors.UserDoesntExistError
	| CreateProfileErrors.ProfileAlreadyExistsError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
