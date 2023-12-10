import { HandleRequestService } from "./handleRequestService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Response } from "express";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { HandleRequestDTO } from "./handleRequestDTO";
import { HandleRequestErrors } from "./handleRequestErrors";

export class HandleRequestController extends BaseController {
	private service: HandleRequestService;

	constructor(service: HandleRequestService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;
		const dto: Omit<HandleRequestDTO, "userId"> = req.body as Omit<HandleRequestDTO, "userId">;

		try {
			const result = await this.service.execute({ ...dto, userId });
			if (result.isLeft()) {
				const error = result.value;
				switch (error.constructor) {
					case HandleRequestErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					case HandleRequestErrors.RequestDoesntExistError:
						return this.notFound(res, error.getError().message);
					case HandleRequestErrors.RequestStatusInvalid:
						return this.clientError(res, error.getError().message);
					case HandleRequestErrors.RequestAlreadyHandled:
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
