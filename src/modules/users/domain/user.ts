import { AccessToken, RefreshToken } from "@modules/users/domain/jwt";
import { UserEmail } from "./userEmail";
import { UserId } from "./userId";
import { UserName } from "./userName";
import { UserPassword } from "./userPassword";
import { Result } from "@shared/core/Result";
import { Validate } from "@shared/core/Validate";
import { AggregateRoot } from "@shared/domain/AggregateRoot";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";

interface UserProps {
	email: UserEmail;
	username: UserName;
	password: UserPassword;
	isEmailVerified?: boolean;
	accessToken?: AccessToken;
	refreshToken?: RefreshToken;
	isDeleted?: boolean;
	lastLogin?: Date;
}

export class User extends AggregateRoot<UserProps> {
	get userId(): UserId {
		return UserId.create(this._id).getValue();
	}

	get email(): UserEmail {
		return this.props.email;
	}

	get username(): UserName {
		return this.props.username;
	}

	get password(): UserPassword {
		return this.props.password;
	}

	get accessToken(): AccessToken {
		return this.props.accessToken as AccessToken;
	}

	get isDeleted(): boolean {
		return this.props.isDeleted as boolean;
	}

	get isEmailVerified(): boolean {
		return this.props.isEmailVerified as boolean;
	}

	get lastLogin(): Date {
		return this.props.lastLogin as Date;
	}

	get refreshToken(): RefreshToken {
		return this.props.refreshToken as RefreshToken;
	}

	public isLoggedIn(): boolean {
		return !!this.props.accessToken && !!this.props.refreshToken;
	}

	public setAccessToken(token: AccessToken, refreshToken: RefreshToken): void {
		// this.addDomainEvent(new UserLoggedIn(this));
		this.props.accessToken = token;
		this.props.refreshToken = refreshToken;
		this.props.lastLogin = new Date();
	}

	public delete(): void {
		if (!this.props.isDeleted) {
			// this.addDomainEvent(new UserDeleted(this));
			this.props.isDeleted = true;
		}
	}

	private constructor(props: UserProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
		const validateResult = Validate.againstNullOrUndefinedMultiple([
			{ argument: props.username, argumentName: "username" },
			{ argument: props.email, argumentName: "email" },
		]);

		if (!validateResult.isSuccess) {
			return Result.fail<User>(validateResult.getError());
		}

		const user = new User(
			{
				...props,
				isDeleted: props.isDeleted ? props.isDeleted : false,
				isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
			},
			id
		);

		return Result.ok<User>(user);
	}
}
