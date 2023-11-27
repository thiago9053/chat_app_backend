import { UserAdapter } from "@modules/users/adapters/userAdapter";
import { User } from "@modules/users/domain/user";
import { UserEmail } from "@modules/users/domain/userEmail";
import { UserId } from "@modules/users/domain/userId";
import { UserName } from "@modules/users/domain/userName";
import { IUserRepo } from "@modules/users/repos/userRepo";
//import { PrismaClient } from "@prisma/client";

export class PrismaUserRepo implements IUserRepo {
	private models: any;

	constructor(models: any) {
		this.models = models;
	}
	async exist(userEmail: UserEmail): Promise<boolean> {
		const user = await this.models.users.findUnique({
			where: {
				email: userEmail.value,
			},
		});
		return !!user;
	}

	async create(user: User): Promise<void> {
		const exist = await this.exist(user.email);
		if (!exist) {
			const rawUser = await UserAdapter.toPersistence(user);
			await this.models.users.createWithPre({ data: rawUser });
		}
		return;
	}

	async getUserByUserName(userName: UserName | string): Promise<User> {
		const user = await this.models.users.findFirst({
			where: {
				username: typeof userName === "string" ? userName : userName.value,
			},
		});

		if (!!user === false) throw new Error("User not found.");
		return UserAdapter.toDomain(user);
	}

	async getUserByUserId(userId: UserId | string): Promise<User | boolean> {
		let uid: string;
		if (userId instanceof UserId) {
			uid = userId.getStringValue();
		} else {
			uid = userId;
		}
		const user = await this.models.users.findUnique({
			where: {
				userId: uid,
			},
		});
		if (!user) return false;
		return UserAdapter.toDomain(user);
	}

	async updateEmail(userId: string, email: UserEmail): Promise<void> {
		await this.models.users.update({
			where: {
				userId: userId,
			},
			data: {
				email: email.value,
			},
		});
	}

	async updatePassword(userId: string, hashedPassword: string): Promise<void> {
		await this.models.users.update({
			where: {
				userId: userId,
			},
			data: {
				password: hashedPassword,
			},
		});
	}
}
