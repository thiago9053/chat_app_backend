export interface FindProfileDTO {
	keyword: string;
	userId: string;
}

export interface FindProfile {
	email?: string;
	name?: string;
	avatarUrl?: string;
	userId: string;
	profileId: string;
}

export interface FindProfileResponseDTO {
	foundProfiles: FindProfile[];
}
