import { AccessToken } from "@modules/auth/domain/jwt";
import { RefreshAccessTokenErrors } from "./refreshAccessTokenErrors";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type RefreshAccessTokenResponse = Either<
	RefreshAccessTokenErrors.RefreshTokenNotFound | AppError.UnexpectedError,
	Result<AccessToken>
>;
