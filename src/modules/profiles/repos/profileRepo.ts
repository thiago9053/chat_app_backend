import { ProfileId } from "@modules/profiles/domain/profileId";
import { Profile } from "../domain/profile";
import { UserId } from "@modules/users/domain/userId";

export interface IProfileRepo {
	create(profile: Profile): Promise<void>;
	getProfileByProfileId?(profileId: ProfileId | string): Promise<Profile>;
	getProfileByUserId(userId: UserId | string): Promise<Profile>;
	updateProfile?(userId: UserId | string, field: string, data: any): Promise<void>;
}
