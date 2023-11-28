import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { ValueObject } from "@shared/domain/ValueObject";

interface CoverImageProps {
	url: string;
	size: number;
}

export class ProfileCoverImage extends ValueObject<CoverImageProps> {
	public static maxSize: number = 1024 * 1024 * 5; // 2MB
	private constructor(props: CoverImageProps) {
		super(props);
	}

	get url(): string {
		return this.props.url;
	}

	get size(): number {
		return this.props.size;
	}

	public static create(props: CoverImageProps): Result<ProfileCoverImage> {
		const maxSizeResult = Validate.lessThan(this.maxSize, props.size);

		if (!maxSizeResult.isSuccess) {
			return Result.fail<ProfileCoverImage>(maxSizeResult.getError());
		}

		return Result.ok<ProfileCoverImage>(new ProfileCoverImage(props));
	}
}
