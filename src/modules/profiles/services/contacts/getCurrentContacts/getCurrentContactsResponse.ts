import { GetCurrentContactsResponseDTO } from "./getCurrentContactsDTO";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type GetCurrentContactsResponse = Either<AppError.UnexpectedError, Result<GetCurrentContactsResponseDTO>>;
