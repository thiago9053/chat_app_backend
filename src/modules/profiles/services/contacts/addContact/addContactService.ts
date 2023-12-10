import { AddContactResponse } from "./addContactResponse";
import { AddContactDTO } from "./addContactDTO";
import { Service } from "@shared/core/Service";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { AddContactErrors } from "./addContactErrors";
import { Profile } from "@modules/profiles/domain/profile";

export class AddContactService implements Service<AddContactDTO, Promise<AddContactResponse>> {
	private profileRepo: IProfileRepo;

	constructor(profileRepo: IProfileRepo) {
		this.profileRepo = profileRepo;
	}

	public async execute(req: AddContactDTO): Promise<AddContactResponse> {
		const { currentProfileId, contactId } = req;
		try {
			const profile: Profile = await this.profileRepo.getProfileByProfileId(contactId);
			const currentProfile: Profile = await this.profileRepo.getProfileByProfileId(currentProfileId);

			if (!profile) return left(new AddContactErrors.RequestingDoesntExistError(contactId));
			if (!currentProfile) return left(new AddContactErrors.CurrentProfileDoesntExistError(currentProfileId));

			const contacts = currentProfile.contactIds;

			const isContactAdlreadyAdded = contacts?.findIndex((_item) => _item === contactId);
			if (isContactAdlreadyAdded && isContactAdlreadyAdded < 0) {
				await this.profileRepo.pushContact(currentProfileId, contactId);
			} else {
				return left(new AddContactErrors.ContactAlreadyAdded(contactId));
			}

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as AddContactResponse;
		}
	}
}
