import { Response } from "express";
import { CreateRequestService } from "./createRequestService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { CreateRequestDTO } from "./createRequestDTO";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { CreateRequestErrors } from "./createRequestErrors";

export class CreateRequestController extends BaseController {
	private service: CreateRequestService;

	constructor(service: CreateRequestService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;
		const dto: Omit<CreateRequestDTO, "userId"> = req.body as Omit<CreateRequestDTO, "userId">;

		try {
			const result = await this.service.execute({ ...dto, userId });

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case CreateRequestErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					case CreateRequestErrors.RequestAlreadyExistsError:
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
