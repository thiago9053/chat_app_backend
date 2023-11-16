export interface UserDTO {
	username: string;
	email: string;
	isEmailVerified?: boolean;
	isDeleted?: boolean;
}
