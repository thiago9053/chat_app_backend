import { LogoutService } from "./logoutService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Response } from "express";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";

export class LogoutController extends BaseController {
	private service: LogoutService;

	constructor(service: LogoutService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		try {
			const result = await this.service.execute({ userId });

			if (result.isLeft()) {
				return this.fail(res, result.value.getError().message);
			} else {
				return this.ok(res);
			}
		} catch (err) {
			return this.fail(res, err as string | Error);
		}
	}
}
