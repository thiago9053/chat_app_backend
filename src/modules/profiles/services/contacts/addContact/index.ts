import { userRepo } from "@modules/users/repos";
import { AddContactService } from "./addContactService";
import { profileRepo } from "@modules/profiles/repos";
import { AddContactController } from "./addContactController";

export const addContactService = new AddContactService(userRepo, profileRepo);
export const addContactController = new AddContactController(addContactService);
