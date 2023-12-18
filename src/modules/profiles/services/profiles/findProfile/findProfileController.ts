import { FindProfileService } from "./findProfileService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Response, Request } from "express";
import { FindProfileDTO } from "./findProfileDTO";

export class FindProfileController extends BaseController {
	private service: FindProfileService;

	constructor(service: FindProfileService) {
		super();
		this.service = service;
	}

	async executeImpl(req: Request, res: Response): Promise<any> {
		const { keyword } = req.query;

		try {
			const result = await this.service.execute({ keyword } as FindProfileDTO);

			if (result.isLeft()) {
				return this.fail(res, result.value.getError().message);
			}

			return this.ok(res, result.value.getValue());
		} catch (err) {
			return this.fail(res, err as Error | string);
		}
	}
}
