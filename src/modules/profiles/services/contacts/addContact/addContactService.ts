import { AddContactResponse } from "./addContactResponse";
import { AddContactDTO } from "./addContactDTO";
import { Service } from "@shared/core/Service";
import { IProfileRepo } from "@modules/profiles/repos/profileRepo";
import { IUserRepo } from "@modules/users/repos/userRepo";
import { left, right } from "@shared/core/types/Either";
import { AppError } from "@shared/core/AppError";
import { Result } from "@shared/core/Result";
import { AddContactErrors } from "./addContactErrors";
import { Profile } from "@modules/profiles/domain/profile";

export class AddContactService implements Service<AddContactDTO, Promise<AddContactResponse>> {
	private profileRepo: IProfileRepo;
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo, profileRepo: IProfileRepo) {
		this.userRepo = userRepo;
		this.profileRepo = profileRepo;
	}

	public async execute(req: AddContactDTO): Promise<AddContactResponse> {
		const { userId, contactId } = req;
		try {
			try {
				const isUserExist = await this.userRepo.getUserByUserId(userId);
				if (!isUserExist) {
					return left(new AddContactErrors.UserDoesntExistError(userId));
				}
			} catch (error) {
				return left(new AddContactErrors.UserDoesntExistError(userId));
			}

			const profile: Profile = await this.profileRepo.getProfileByProfileId(contactId);
			const currentProfile: Profile = await this.profileRepo.getProfileByUserId(userId);

			if (!profile) return left(new AddContactErrors.RequestingDoesntExistError(contactId));

			const contacts = currentProfile.contactIds;

			const isContactAdlreadyAdded = contacts?.findIndex((_item) => _item === contactId);
			if (isContactAdlreadyAdded && isContactAdlreadyAdded < 0) {
				await this.profileRepo.pushContact(userId, contactId);
			} else {
				return left(new AddContactErrors.ContactAlreadyAdded(contactId));
			}

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err)) as AddContactResponse;
		}
	}
}
