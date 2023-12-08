import { RequestId } from "./requestId";
import { AggregateRoot } from "@shared/domain/AggregateRoot";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { ProfileId } from "@modules/profiles/domain/profileId";
import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";

export type RequestStatus = "Pending" | "Rejected" | "Accepted";

interface RequestProps {
	requestedBy: ProfileId;
	requesting: ProfileId;
	createdAt: Date;
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

	get createdAt(): Date {
		return this.props.createdAt;
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
