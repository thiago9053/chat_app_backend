import { UpdateProfileDTO } from "@modules/profiles/services/updateProfile/updateProfileDTO";
import { UpdateProfileService } from "@modules/profiles/services/updateProfile/updateProfileService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { Response } from "express";
import { UpdateProfileErrors } from "@modules/profiles/services/updateProfile/updateProfileError";

export class UpdateProfileController extends BaseController {
	private service: UpdateProfileService;

	constructor(service: UpdateProfileService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;
		const dto: Omit<UpdateProfileDTO, "userId"> = req.body as Omit<UpdateProfileDTO, "userId">;

		try {
			const result = await this.service.execute({ ...dto, userId });
			if (result.isLeft()) {
				const error = result.value;
				switch (error.constructor) {
					case UpdateProfileErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					case UpdateProfileErrors.PhoneNumberAlreadyExistsError:
						return this.conflict(res, error.getError().message);
					case UpdateProfileErrors.FieldDoesntExistsError:
						return this.notFound(res, error.getError().message);
					case UpdateProfileErrors.ProfileAlreadyExistsError:
						return this.conflict(res, error.getError().message);
					default:
						return this.fail(res, error.getError());
				}
			} else {
				return this.ok(res);
			}
		} catch (err) {
			return this.fail(res, err as string | Error);
		}
	}
}
