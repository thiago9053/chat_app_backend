import { ListRequestErrors } from "./listRequestErrors";
import { ListRequestResponseDTO } from "./listRequestDTO";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type ListRequestResponse = Either<
	ListRequestErrors.UserDoesntExistError | AppError.UnexpectedError,
	Result<ListRequestResponseDTO>
>;
