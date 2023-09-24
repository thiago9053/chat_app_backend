import { Result } from "./Result";

export interface IValidateArgument {
	argument: any;
	argumentName: string;
}

export type ValidateResponse = string;

export type ValidateArgumentCollection = IValidateArgument[];

export class Validate {
	public static combine(validateResults: Result<any>[]): Result<ValidateResponse> {
		for (let result of validateResults) {
			if (!result.isSuccess) return result;
		}
		return Result.ok<ValidateResponse>();
	}

	public static greaterThan(minValue: number, actualValue: number): Result<ValidateResponse> {
		return actualValue > minValue
			? Result.ok<ValidateResponse>()
			: Result.fail<ValidateResponse>(`Number given {${actualValue}} is not greater than {${minValue}}`);
	}

	public static lessThan(maxValue: number, actualValue: number): Result<ValidateResponse> {
		return actualValue < maxValue
			? Result.ok<ValidateResponse>()
			: Result.fail<ValidateResponse>(`Number given {${actualValue}} is not less than {${maxValue}}`);
	}

	public static againstAtLeast(numChars: number, text: string): Result<ValidateResponse> {
		return text.length >= numChars
			? Result.ok<ValidateResponse>()
			: Result.fail<ValidateResponse>(`Text is not at least ${numChars} chars.`);
	}

	public static againstAtMost(numChars: number, text: string): Result<ValidateResponse> {
		return text.length <= numChars
			? Result.ok<ValidateResponse>()
			: Result.fail<ValidateResponse>(`Text is greater than ${numChars} chars.`);
	}

	public static againstNullOrUndefined(argument: any, argumentName: string): Result<ValidateResponse> {
		if (argument === null || argument === undefined) {
			return Result.fail<ValidateResponse>(`${argumentName} is null or undefined`);
		} else {
			return Result.ok<ValidateResponse>();
		}
	}

	public static againstNullOrUndefinedMultiple(args: ValidateArgumentCollection): Result<ValidateResponse> {
		for (let arg of args) {
			const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
			if (!result.isSuccess) return result;
		}

		return Result.ok<ValidateResponse>();
	}
}
