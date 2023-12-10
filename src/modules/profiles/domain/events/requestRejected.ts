import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Request } from "../request";
import { IDomainEvent } from "@shared/domain/events/IDomainEvent";

export class RequestRejected implements IDomainEvent {
	public dateTimeOccurred: Date;
	public request: Request;

	constructor(request: Request) {
		this.dateTimeOccurred = new Date();
		this.request = request;
	}

	getAggregateId(): UniqueEntityID {
		return this.request.id;
	}
}
