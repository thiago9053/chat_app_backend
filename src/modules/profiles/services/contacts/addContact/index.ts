import { AddContactService } from "./addContactService";
import { profileRepo } from "@modules/profiles/repos";

export const addContactService = new AddContactService(profileRepo);
