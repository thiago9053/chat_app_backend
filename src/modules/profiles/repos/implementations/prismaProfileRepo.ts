import { IProfileRepo } from "../profileRepo";
import { ProfileAdapter } from "@modules/profiles/adapters/profileAdapter";
import { Profile } from "@modules/profiles/domain/profile";
import { UserId } from "@modules/users/domain/userId";
import { ExtendedPrismaClient } from "@shared/infra/database/prisma";
//import { PrismaClient } from "@prisma/client";

export class PrismaProfileRepo implements IProfileRepo {
	private models: ExtendedPrismaClient;

	constructor(models: ExtendedPrismaClient) {
		this.models = models;
	}

	async create(profile: Profile): Promise<void> {
		const rawProfile = await ProfileAdapter.toPersistence(profile);
		await this.models.profiles.create({ data: rawProfile });
	}

	async getProfileByUserId(userId: string | UserId): Promise<Profile> {
		let uid: string;
		if (userId instanceof UserId) {
			uid = userId.getStringValue();
		} else {
			uid = userId;
		}
		const profile = await this.models.profiles.findUnique({
			where: {
				userId: uid,
			},
		});
		if (!profile) throw new Error("Profile not found.");
		return ProfileAdapter.toDomain(profile);
	}
}
