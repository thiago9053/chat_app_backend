import { DeleteRequestResponse } from "./deleteRequestResponse";
import { DeleteRequestDTO } from "./deleteRequestDTO";
import { Service } from "@shared/core/Service";
import { IRequestRepo } from "@modules/profiles/repos/requestRepo";
import { left, right } from "@shared/core/types/Either";
import { Result } from "@shared/core/Result";
import { Request } from "@modules/profiles/domain/request";
import { DeleteRequestErrors } from "./deleteRequestErrors";
import { AppError } from "@shared/core/AppError";

export class DeleteRequestService implements Service<DeleteRequestDTO, Promise<DeleteRequestResponse>> {
	private requestRepo: IRequestRepo;

	constructor(requestRepo: IRequestRepo) {
		this.requestRepo = requestRepo;
	}

	public async execute(req: DeleteRequestDTO): Promise<DeleteRequestResponse> {
		let request: Request;
		const { requestId } = req;
		try {
			try {
				request = await this.requestRepo.getRequestByRequetsId(requestId);
				if (!request) {
					return left(new DeleteRequestErrors.RequestDoesntExistError(requestId));
				}
			} catch (error) {
				return left(new DeleteRequestErrors.RequestDoesntExistError(requestId));
			}

			await this.requestRepo.delete(requestId);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as DeleteRequestResponse;
		}
	}
}
