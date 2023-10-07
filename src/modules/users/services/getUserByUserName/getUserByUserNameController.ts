import { GetUserByUserNameError } from "./getUserByUserNameError";
import { GetUserByUserNameDTO } from "./getUserByUserNameDTO";
import { GetUserByUserNameService } from "./getUserByUserNameService";
import * as express from "express";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { BaseController } from "@shared/infra/controller/BaseController";

export class GetUserByUserNameController extends BaseController {
	private service: GetUserByUserNameService;

	constructor(service: GetUserByUserNameService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
		const dto: GetUserByUserNameDTO = req.body as GetUserByUserNameDTO;

		try {
			const result = await this.service.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case GetUserByUserNameError.UserNotFoundError:
						return this.notFound(res, error.getError().message);
					default:
						return this.fail(res, error.getError().message);
				}
			} else {
				return this.ok(res);
			}
		} catch (err) {
			return this.fail(res, err as string | Error);
		}
	}
}
