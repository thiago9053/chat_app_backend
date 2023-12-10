import { GetCurrentContactsService } from "./getCurrentContactsService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { Response } from "express";

export class GetCurrentContactsController extends BaseController {
	private service: GetCurrentContactsService;

	constructor(service: GetCurrentContactsService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		try {
			const result = await this.service.execute({ userId });

			if (result.isLeft()) {
				return this.fail(res, result.value.getError().message);
			}

			return this.ok(res, result.value.getValue());
		} catch (err) {
			return this.fail(res, err as Error | string);
		}
	}
}
