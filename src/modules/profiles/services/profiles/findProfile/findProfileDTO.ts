export interface FindProfileDTO {
	keyword: string;
}

export interface FindProfile {
	email?: string;
	name?: string;
	avatarUrl?: string;
	userId: string;
}

export interface FindProfileResponseDTO {
	foundProfiles: FindProfile[];
}
