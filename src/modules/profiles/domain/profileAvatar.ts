import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface AvatarProps {
	url: string;
	size: number;
}

export class ProfileAvatar extends ValueObject<AvatarProps> {
	public static maxSize: number = 1024 * 1024 * 2; // 2MB
	private constructor(props: AvatarProps) {
		super(props);
	}

	get url(): string {
		return this.props.url;
	}

	get size(): number {
		return this.props.size;
	}

	public static create(props: AvatarProps): Result<ProfileAvatar> {
		const maxSizeResult = Validate.lessThan(this.maxSize, props.size);
		if (!maxSizeResult.isSuccess) {
			return Result.fail<ProfileAvatar>(maxSizeResult.getError());
		}

		return Result.ok<ProfileAvatar>(new ProfileAvatar(props));
	}
}
