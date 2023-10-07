import { AccessToken, RefreshToken } from "@modules/users/domain/jwt";
import { LoginUseCaseErrors } from "@modules/users/services/login/loginErrors";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export interface LoginDTOResponse {
	accessToken: AccessToken;
	refreshToken: RefreshToken;
}

export type LoginResponse = Either<
	LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
	Result<LoginDTOResponse>
>;
