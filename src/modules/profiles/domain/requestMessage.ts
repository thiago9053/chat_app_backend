import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface MessageProps {
	message: string;
}

export class RequestMessage extends ValueObject<MessageProps> {
	public static maxLength: number = 500;

	get value(): string {
		return this.props.message;
	}

	private constructor(props: MessageProps) {
		super(props);
	}

	public static create(props: MessageProps): Result<RequestMessage> {
		const maxLengthResult = Validate.againstAtMost(this.maxLength, props.message);
		if (!maxLengthResult.isSuccess) {
			return Result.fail<RequestMessage>(maxLengthResult.getError());
		}

		return Result.ok<RequestMessage>(new RequestMessage(props));
	}
}
