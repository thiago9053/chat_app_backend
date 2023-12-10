import { createProfileService } from "@modules/profiles/services/profiles/createProfile";
import { AfterUserCreated } from "./afterUserCreated";
import { AfterAcceptRequest } from "./afterAcceptRequest";
import { addContactService } from "@modules/profiles/services/contacts/addContact";
import { AfterRejectRequest } from "@modules/profiles/subscriptions/afterRejectRequest";
import { deleteRequestService } from "@modules/profiles/services/requests/deleteRequest";

new AfterUserCreated(createProfileService);
new AfterAcceptRequest(addContactService);
new AfterRejectRequest(deleteRequestService);
