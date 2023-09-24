import { User } from "@modules/users/domain/user";
import { UserEmail } from "@modules/users/domain/userEmail";
import { UserId } from "@modules/users/domain/userId";
import { UserName } from "@modules/users/domain/userName";

export interface IUserRepo {
	create(user: User): Promise<void>;
	delete?(userId: UserId): Promise<void>;
	exist(userEmail: UserEmail): Promise<boolean>;
	getUserByUserId?(userId: UserId): Promise<User>;
	getUserByUserName(userName: UserName): Promise<User | boolean>;
}
