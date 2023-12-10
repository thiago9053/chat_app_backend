export interface GetCurrentContactsDTO {
	userId: string;
}

export interface Contact {
	location?: string;
	phoneNumner?: string;
	signature?: string;
	avatarUrl?: string;
	coverImageUrl?: string;
	name?: string;
	email?: string;
	lastLogin?: Date;
	username?: string;
}

export interface GetCurrentContactsResponseDTO {
	contacts: Contact[];
}
