import { RequestStatus } from "@modules/profiles/domain/request";

export interface HandleRequestDTO {
	status: RequestStatus;
	userId: string;
	requestId: string;
}
