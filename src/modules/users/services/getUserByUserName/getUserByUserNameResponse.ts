import { User } from "@modules/users/domain/user";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type GetUserByUserNameResponse = Either<AppError.UnexpectedError, Result<User>>;
