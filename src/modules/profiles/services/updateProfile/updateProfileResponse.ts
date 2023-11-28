import { UpdateProfileErrors } from "@modules/profiles/services/updateProfile/updateProfileError";
import { Result } from "@shared/core/Result";
import { Either } from "@shared/core/types/Either";

export type UpdateProfileResponse = Either<
	| UpdateProfileErrors.PhoneNumberAlreadyExistsError
	| UpdateProfileErrors.ProfileAlreadyExistsError
	| UpdateProfileErrors.UserDoesntExistError
	| Result<any>,
	Result<void>
>;
