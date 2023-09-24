import { Result } from "@shared/core/Result";
import { CreateUserErrors } from "./createUserErrors";
import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";

export type CreateUserResponse = Either<
	| CreateUserErrors.EmailAlreadyExistsError
	| CreateUserErrors.UsernameTakenError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
