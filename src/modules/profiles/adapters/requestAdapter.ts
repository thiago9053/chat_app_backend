import { Request } from "@modules/profiles/domain/request";

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
}
