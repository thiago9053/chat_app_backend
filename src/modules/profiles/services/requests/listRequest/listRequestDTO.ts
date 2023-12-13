export interface ListRequestDTO {
	userId: string;
}

export interface RequestItem {
	createAt?: Date;
	name: string;
	email: string;
	avatarUrl: string;
}

export interface ListRequestResponseDTO {
	requestItems: RequestItem[];
}
