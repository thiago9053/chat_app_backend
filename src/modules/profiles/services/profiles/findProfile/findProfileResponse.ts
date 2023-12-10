import { FindProfileResponseDTO } from "./findProfileDTO";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type FindProfileResponse = Either<AppError.UnexpectedError, Result<FindProfileResponseDTO>>;
