import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { ChangeEmailDTO } from "./changeEmailDTO";
import { ChangeEmailErrors } from "./changeEmailErrors";
import { ChangeEmailService } from "./changeEmailService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Response } from "express";

export class ChangeEmailController extends BaseController {
	private service: ChangeEmailService;

	constructor(service: ChangeEmailService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;
		const dto: Omit<ChangeEmailDTO, "userId"> = req.body as Omit<ChangeEmailDTO, "userId">;

		try {
			const result = await this.service.execute({ ...dto, userId });

			if (result.isLeft()) {
				const error = result.value;
				switch (error.constructor) {
					case ChangeEmailErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					case ChangeEmailErrors.SameEmail:
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
