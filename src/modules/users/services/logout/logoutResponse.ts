import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type LogoutResponse = Either<AppError.UnexpectedError, Result<void>>;
