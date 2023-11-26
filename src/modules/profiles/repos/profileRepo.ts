import { ProfileId } from "@modules/profiles/domain/profileId";
import { Profile } from "../domain/profile";

export interface IProfileRepo {
	create(profile: Profile): Promise<void>;
	getProfileByProfileId(profileId: ProfileId | string): Promise<Profile>;
	getProfileByUserId(userId: string): Promise<Profile>;
}
