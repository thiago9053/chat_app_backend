export class Result<T> {
	public isSuccess: boolean;
	private error: T | string | undefined;
	private value: T | undefined;

	public constructor(isSuccess: boolean, error?: T | string, value?: T) {
		if (isSuccess && error) {
			throw new Error("InvalidOperation: A result cannot be successful and contain an error");
		}
		if (!isSuccess && !error) {
			throw new Error("InvalidOperation: A failing result needs to contain an error message");
		}

		this.isSuccess = isSuccess;
		this.error = error;
		this.value = value;

		Object.freeze(this);
	}

	public getValue(): T {
		if (!this.isSuccess) {
			console.log(this.error);
			throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
		}
		return this.value as T;
	}

	public getError(): T {
		return this.error as T;
	}

	public static ok<U>(value?: U): Result<U> {
		return new Result<U>(true, undefined, value);
	}

	public static fail<U>(error: string): Result<U> {
		return new Result<U>(false, error);
	}

	public static combine(results: Result<any>[]): Result<any> {
		for (let result of results) {
			if (!result.isSuccess) return result;
		}
		return Result.ok();
	}
}
