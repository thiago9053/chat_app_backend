import { GetUserByUserNameService } from "@modules/users/services/getUserByUserName/getUserByUserNameService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { Response } from "express";
import { UserAdapter } from "@modules/users/adapters/userAdapter";

export class GetCurrentUserController extends BaseController {
	private service: GetUserByUserNameService;

	constructor(service: GetUserByUserNameService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { username } = req.decoded;

		try {
			const result = await this.service.execute({ username });

			if (result.isLeft()) {
				return this.fail(res, result.value.getError().message);
			} else {
				const user = result.value.getValue();
				return this.ok(res, {
					user: UserAdapter.toDTO(user),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error | string);
		}
	}
}
