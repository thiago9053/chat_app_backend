import { ProfileId } from "@modules/profiles/domain/profileId";
import { Request } from "@modules/profiles/domain/request";
import { RequestMessage } from "@modules/profiles/domain/requestMessage";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";

export class RequestAdapter {
	public static async toPersistence(request: Request): Promise<any> {
		return {
			requestId: request.requestId.getStringValue(),
			requestedBy: request.requestedBy.getStringValue(),
			requesting: request.requesting.getStringValue(),
			createdAt: new Date(),
			status: request.status || "Pending",
			message: request.message.value,
		};
	}

	public static async toDomain(raw: any): Promise<Request> {
		const requestOrError = Request.create(
			{
				requestedBy: ProfileId.create(new UniqueEntityID(raw.requestedBy)).getValue(),
				requesting: ProfileId.create(new UniqueEntityID(raw.requesting)).getValue(),
				status: raw.status,
				createdAt: raw.createdAt,
				message: RequestMessage.create({ message: raw.message }).getValue(),
			},
			new UniqueEntityID(raw.requestId)
		);

		!requestOrError.isSuccess ? console.log(requestOrError.getError()) : "";

		return requestOrError.getValue();
	}
}
