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

	async pushContact(currentProfileId: string, contactId: string): Promise<void> {
		await this.models.profiles.update({
			where: {
				profileId: currentProfileId,
			},
			data: {
				contactIds: {
					push: contactId,
				},
			},
		});
	}

	async getContacts(userId: string): Promise<any> {
		const profile = await this.models.profiles.findUnique({
			where: { userId },
		});

		const profiles = await this.models.profiles.findMany({
			where: {
				OR: profile?.contactIds.map((id) => ({
					profileId: id,
				})),
			},

			select: {
				userId: true,
				location: true,
				phoneNumber: true,
				signature: true,
				avatarUrl: true,
				coverImageUrl: true,
				name: true,
			},
		});

		const users = await this.models.users.findMany({
			where: {
				OR: profiles.map((profile) => ({
					userId: profile.userId,
				})),
			},
			select: {
				userId: true,
				lastLogin: true,
				username: true,
				email: true,
			},
		});

		return { profiles, users };
	}

	async findByKeyword(keyword: string): Promise<any> {
		const profiles = await this.models.profiles.findMany({
			where: {
				OR: [
					{
						name: {
							contains: keyword,
						},
					},
					{
						name: {
							contains: keyword.toLowerCase(),
						},
					},
					{
						name: {
							contains: keyword.toUpperCase(),
						},
					},
				],
			},
		});

		const users = await this.models.users.findMany({
			where: {
				OR: [
					{
						email: {
							contains: keyword,
						},
					},
					{
						email: {
							contains: keyword.toLowerCase(),
						},
					},
					{
						email: {
							contains: keyword.toUpperCase(),
						},
					},
				],
			},
		});

		const foundUserIds = profiles.map((profile) => profile.userId).concat(users.map((user) => user.userId));

		const listProfiles = await this.models.profiles.findMany({
			where: { OR: foundUserIds.map((id) => ({ userId: id })) },
			select: { avatarUrl: true, name: true, signature: true, profileId: true, userId: true },
		});
		const listUsers = await this.models.users.findMany({
			where: { OR: foundUserIds.map((id) => ({ userId: id })) },
			select: { email: true, userId: true },
		});

		return { profiles: listProfiles, users: listUsers };
	}

	async getProfilesByProfileIds(profileIds: string[], fields?: { [key: string]: boolean }): Promise<Profile[]> {
		const profiles = await this.models.profiles.findMany({
			where: {
				OR: profileIds.map((id) => ({ profileId: id })),
			},
			...(fields && { select: fields }),
		});

		let result: Profile[] = [];
		for (let i = 0; i < profiles.length; i++) {
			const domain = ProfileAdapter.toDomain(profiles[i]);
			result.push(domain);
		}
		return result;
	}
}
