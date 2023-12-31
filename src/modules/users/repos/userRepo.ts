import { User } from "@modules/users/domain/user";
import { UserEmail } from "@modules/users/domain/userEmail";
import { UserId } from "@modules/users/domain/userId";
import { UserName } from "@modules/users/domain/userName";

export interface IUserRepo {
	create(user: User): Promise<void>;
	delete?(userId: UserId): Promise<void>;
	exist(userEmail: UserEmail): Promise<boolean>;
	getUserByUserId(userId: UserId | string): Promise<User | boolean>;
	getUserByUserName(userName: UserName | string): Promise<User>;
	updateEmail(userId: string, email: UserEmail): Promise<void>;
	updatePassword(userId: string, hasedPassword: string): Promise<void>;
	updateLastLogin(userId: string): Promise<void>;
	getUsers(userIds: string[], fields?: { [key: string]: boolean }): Promise<User[]>;
}
