import { ListRequestService } from "./listRequestService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { Response } from "express";
import { ListRequestErrors } from "./listRequestErrors";

export class ListRequestController extends BaseController {
	private service: ListRequestService;

	constructor(service: ListRequestService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		try {
			const result = await this.service.execute({ userId });
			if (result.isLeft()) {
				const error = result.value;
				switch (error.constructor) {
					case ListRequestErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					default:
						return this.fail(res, result.value.getError().message);
				}
			} else {
				return this.ok(res, result.value.getValue());
			}
		} catch (err) {
			return this.fail(res, err as Error | string);
		}
	}
}
