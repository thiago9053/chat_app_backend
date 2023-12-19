import { FindProfileService } from "./findProfileService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Response } from "express";
import { FindProfileDTO } from "./findProfileDTO";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";

export class FindProfileController extends BaseController {
	private service: FindProfileService;

	constructor(service: FindProfileService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { keyword } = req.query;
		const { userId } = req.decoded;

		try {
			const result = await this.service.execute({ keyword, userId } as FindProfileDTO);

			if (result.isLeft()) {
				return this.fail(res, result.value.getError().message);
			}

			return this.ok(res, result.value.getValue());
		} catch (err) {
			return this.fail(res, err as Error | string);
		}
	}
}
