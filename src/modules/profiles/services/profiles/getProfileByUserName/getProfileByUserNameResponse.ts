import { AppError } from "@shared/core/AppError";
import { Either } from "@shared/core/types/Either";
import { Result } from "@shared/core/Result";
import { Profile } from "@modules/profiles/domain/profile";

export type GetProfileByUserNameResponse = Either<AppError.UnexpectedError, Result<Profile>>;
