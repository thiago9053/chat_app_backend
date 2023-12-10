import { ProfileId } from "@modules/profiles/domain/profileId";
import { Request } from "@modules/profiles/domain/request";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";

export class RequestAdapter {
	public static async toPersistence(request: Request): Promise<any> {
		return {
			requestId: request.requestId.getStringValue(),
			requestedBy: request.requestedBy.getStringValue(),
			requesting: request.requesting.getStringValue(),
			createdAt: new Date(),
			status: request.status || "Pending",
		};
	}

	public static async toDomain(raw: any): Promise<Request> {
		const requestOrError = Request.create(
			{
				requestedBy: ProfileId.create(new UniqueEntityID(raw.requestedBy)).getValue(),
				requesting: ProfileId.create(new UniqueEntityID(raw.requesting)).getValue(),
				status: raw.status,
				createdAt: raw.createAt,
			},
			new UniqueEntityID(raw.requestId)
		);

		!requestOrError.isSuccess ? console.log(requestOrError.getError()) : "";

		return requestOrError.getValue();
	}
}
