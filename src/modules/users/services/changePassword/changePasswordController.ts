import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { ChangePasswordErrors } from "./changePasswordErrors";
import { ChangePasswordService } from "./changePasswordService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Response } from "express";
import { ChangePasswordDTO } from "./changePasswordDTO";

export class ChangePasswordController extends BaseController {
	private service: ChangePasswordService;

	constructor(service: ChangePasswordService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;
		const dto: Omit<ChangePasswordDTO, "userId"> = req.body as Omit<ChangePasswordDTO, "userId">;

		try {
			const result = await this.service.execute({ ...dto, userId });

			if (result.isLeft()) {
				const error = result.value;
				switch (error.constructor) {
					case ChangePasswordErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					case ChangePasswordErrors.SameAsOldPassword:
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
