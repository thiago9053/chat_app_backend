export interface ListRequestDTO {
	userId: string;
}

export interface RequestItem {
	createdAt?: Date;
	name: string;
	email: string;
	avatarUrl: string;
	message?: string;
	requestId: string;
}

export interface ListRequestResponseDTO {
	requestItems: RequestItem[];
}
