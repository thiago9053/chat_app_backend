import { RequestId } from "./requestId";
import { AggregateRoot } from "@shared/domain/AggregateRoot";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { ProfileId } from "@modules/profiles/domain/profileId";
import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { RequestAccepted } from "./events/requestAccepted";
import { RequestRejected } from "./events/requestRejected";
import { RequestMessage } from "./requestMessage";

export type RequestStatus = "Pending" | "Rejected" | "Accepted";

interface RequestProps {
	requestedBy: ProfileId;
	requesting: ProfileId;
	createdAt: Date;
	message: RequestMessage;
	status: RequestStatus;
}

export class Request extends AggregateRoot<RequestProps> {
	private constructor(props: RequestProps, id?: UniqueEntityID) {
		super(props, id);
	}

	get requestId(): RequestId {
		return ProfileId.create(this._id).getValue();
	}

	get requestedBy(): ProfileId {
		return this.props.requestedBy;
	}

	get requesting(): ProfileId {
		return this.props.requesting;
	}

	get status(): RequestStatus {
		return this.props.status;
	}

	get message(): RequestMessage {
		return this.props.message;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	acceptRequest(): Result<void> {
		this.props.status = "Accepted";
		this.addDomainEvent(new RequestAccepted(this));
		return Result.ok<void>();
	}

	rejectRequest(): Result<void> {
		this.props.status = "Rejected";
		this.addDomainEvent(new RequestRejected(this));
		return Result.ok<void>();
	}

	public static create(props: RequestProps, id?: UniqueEntityID): Result<Request> {
		const validateResult = Validate.againstNullOrUndefinedMultiple([
			{ argument: props.requestedBy, argumentName: "requested user" },
			{ argument: props.requesting, argumentName: "requesting user" },
		]);

		if (!validateResult.isSuccess) {
			return Result.fail<Request>(validateResult.getError());
		}

		const request = new Request({ ...props }, id);
		return Result.ok<Request>(request);
	}
}
