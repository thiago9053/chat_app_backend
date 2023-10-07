import { LoginService } from "./loginService";
import { LoginDTOResponse } from "./loginResponse";
import { LoginDTO } from "./loginDTO";
import { LoginUseCaseErrors } from "./loginErrors";
import * as express from "express";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { BaseController } from "@shared/infra/controller/BaseController";

export class LoginController extends BaseController {
	private service: LoginService;

	constructor(service: LoginService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
		const dto: LoginDTO = req.body as LoginDTO;

		try {
			const result = await this.service.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case LoginUseCaseErrors.UserNameDoesntExistError:
						return this.notFound(res, error.getError().message);
					case LoginUseCaseErrors.PasswordDoesntMatchError:
						return this.clientError(res, error.getError().message);
					default:
						return this.fail(res, error.getError().message);
				}
			} else {
				const dto: LoginDTOResponse = result.value.getValue() as LoginDTOResponse;
				return this.ok<LoginDTOResponse>(res, dto);
			}
		} catch (err) {
			return this.fail(res, err as string | Error);
		}
	}
}
