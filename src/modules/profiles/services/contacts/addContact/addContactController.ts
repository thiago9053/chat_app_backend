import { BaseController } from "@shared/infra/controller/BaseController";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { Response } from "express";
import { AddContactService } from "./addContactService";
import { AddContactDTO } from "./addContactDTO";
import { AddContactErrors } from "./addContactErrors";

export class AddContactController extends BaseController {
	private service: AddContactService;

	constructor(service: AddContactService) {
		super();
		this.service = service;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;
		const dto: Omit<AddContactDTO, "userId"> = req.body as Omit<AddContactDTO, "userId">;

		try {
			const result = await this.service.execute({ ...dto, userId });
			if (result.isLeft()) {
				const error = result.value;
				switch (error.constructor) {
					case AddContactErrors.UserDoesntExistError:
						return this.notFound(res, error.getError().message);
					case AddContactErrors.RequestingDoesntExistError:
						return this.notFound(res, error.getError().message);
					case AddContactErrors.RequestDoesntExistsError:
						return this.notFound(res, error.getError().message);
					case AddContactErrors.ContactAlreadyAdded:
						return this.conflict(res, error.getError().message);
					default:
						return this.fail(res, error.getError());
				}
			} else {
				return this.ok(res);
			}
		} catch (err) {
			return this.fail(res, err as string | Error);
		}
	}
}
