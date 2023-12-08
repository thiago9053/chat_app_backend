import { IProfileRepo } from "../profileRepo";
import { ProfileAdapter } from "@modules/profiles/adapters/profileAdapter";
import { Profile } from "@modules/profiles/domain/profile";
import { ProfileId } from "@modules/profiles/domain/profileId";
import { UserId } from "@modules/users/domain/userId";
import { ExtendedPrismaClient } from "@shared/infra/database/prisma";

export class PrismaProfileRepo implements IProfileRepo {
	private models: ExtendedPrismaClient;

	constructor(models: ExtendedPrismaClient) {
		this.models = models;
	}

	async exist(profileId: string): Promise<boolean> {
		try {
			const profile = await this.models.profiles.findUnique({
				where: {
					profileId,
				},
			});

			return !!profile;
		} catch (error) {
			return false;
		}
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

	async getProfileByProfileId(profileId: string | ProfileId): Promise<Profile> {
		let pid: string;
		if (profileId instanceof ProfileId) {
			pid = profileId.getStringValue();
		} else {
			pid = profileId;
		}
		const profile = await this.models.profiles.findUnique({
			where: {
				profileId: pid,
			},
		});
		console.log(62, profile);
		if (!profile) throw new Error("Profile not found.");
		return ProfileAdapter.toDomain(profile);
	}

	async updateProfile(userId: string | UserId, field: string, data: any): Promise<void> {
		try {
			let uid: string;
			if (userId instanceof UserId) {
				uid = userId.getStringValue();
			} else {
				uid = userId;
			}

			await this.models.profiles.update({
				where: {
					userId: uid,
				},
				data: {
					[field]: data,
				},
			});
		} catch (error) {
			throw new Error(`Update ${field} failed`);
		}
	}

	async pushContact(userId: string | UserId, contactId: string): Promise<void> {
		let uid: string;
		if (userId instanceof UserId) {
			uid = userId.getStringValue();
		} else {
			uid = userId;
		}

		await this.models.profiles.update({
			where: {
				userId: uid,
			},
			data: {
				contactIds: {
					push: contactId,
				},
			},
		});
	}
}
