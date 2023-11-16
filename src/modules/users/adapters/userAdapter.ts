import { UserName } from "@modules/users/domain/userName";
import { User } from "../domain/user";
import { UserPassword } from "@modules/users/domain/userPassword";
import { UserEmail } from "@modules/users/domain/userEmail";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { UserDTO } from "@modules/users/dtos/userDTO";

export class UserAdapter {
	public static toDTO(user: User): UserDTO {
		return {
			username: user.username.value,
			isEmailVerified: user.isEmailVerified,
			isDeleted: user.isDeleted,
			email: user.email.value,
		};
	}

	public static toDomain(raw: any): User {
		const userNameOrError = UserName.create({ name: raw.username });
		const userPasswordOrError = UserPassword.create({ value: raw.password, hashed: true });
		const userEmailOrError = UserEmail.create(raw.user_email);

		const userOrError = User.create(
			{
				username: userNameOrError.getValue(),
				isDeleted: raw.isDeleted,
				isEmailVerified: raw.isDeleted,
				password: userPasswordOrError.getValue(),
				email: userEmailOrError.getValue(),
			},
			new UniqueEntityID(raw.userId)
		);

		!userOrError.isSuccess ? console.log(userOrError.getError()) : "";

		return userOrError.getValue();
	}

	static async toPersistence(user: User): Promise<any> {
		let password: string | null = null;
		if (!!user.password === true) {
			if (user.password.isAlreadyHashed()) {
				password = user.password.value;
			} else {
				password = await user.password.getHashedValue();
			}
		}

		return {
			userId: user.userId.getStringValue(),
			username: user.username.value,
			email: user.email.value,
			password,
			isDeleted: user.isDeleted,
			isEmailVerified: user.isEmailVerified,
		};
	}
}
