import { CreateUserDTO } from "./createUserDTO";
import { CreateUserErrors } from "./createUserErrors";
import { CreateUserService } from "./createUserService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Request, Response } from "express";

export class CreateUserController extends BaseController {
	private service: CreateUserService;

	constructor(service: CreateUserService) {
		super();
		this.service = service;
	}

	async executeImpl(req: Request, res: Response): Promise<any> {
		const dto: CreateUserDTO = req.body as CreateUserDTO;

		try {
			const result = await this.service.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case CreateUserErrors.UsernameTakenError:
						return this.conflict(res, error.getError().message);
					case CreateUserErrors.EmailAlreadyExistsError:
						return this.conflict(res, error.getError().message);
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
