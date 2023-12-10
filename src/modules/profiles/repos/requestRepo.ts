import { Request, RequestStatus } from "@modules/profiles/domain/request";
import { RequestId } from "@modules/profiles/domain/requestId";

export interface IRequestRepo {
	create(request: Request): Promise<void>;
	exist(requesting: string, requestedBy: string): Promise<boolean>;
	updateRequest(requestId: RequestId | string, status: RequestStatus): Promise<void>;
	getRequestByRequetsId(requestId: string): Promise<Request>;
	delete(requestId: string): Promise<void>;
	list(userId: string): Promise<Request[]>;
}
