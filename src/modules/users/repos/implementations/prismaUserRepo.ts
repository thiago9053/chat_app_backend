import { UserAdapter } from "@modules/users/adapters/userAdapter";
import { User } from "@modules/users/domain/user";
import { UserEmail } from "@modules/users/domain/userEmail";
import { UserId } from "@modules/users/domain/userId";
import { UserName } from "@modules/users/domain/userName";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { PrismaClient } from "@prisma/client";

export class PrismaUserRepo implements IUserRepo {
	private models: PrismaClient;

	constructor(models: PrismaClient) {
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
			await this.models.users.create({ data: rawUser });
		}
		return;
	}

	async getUserByUserName(userName: UserName): Promise<User | boolean> {
		const user = await this.models.users.findFirst({
			where: {
				username: userName.value,
			},
		});
		console.log(user);

		if (!!user === false) return false;
		return UserAdapter.toDomain(user);
	}

	async getUserByUserId(userId: UserId | string): Promise<User | boolean> {
		let uid: string;
		if (userId instanceof UserId) uid = userId.getStringValue();
		else uid = userId;
		const user = await this.models.users.findFirst({
			where: {
				id: uid,
			},
		});

		if (!!user === false) return false;
		return UserAdapter.toDomain(user);
	}
}
