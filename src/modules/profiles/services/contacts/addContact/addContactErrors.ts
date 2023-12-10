import { ServiceError } from "@shared/core/ServiceError";
import { Result } from "@shared/core/Result";

export namespace AddContactErrors {
	export class CurrentProfileDoesntExistError extends Result<ServiceError> {
		constructor(currentId: string) {
			super(false, {
				message: `A user for user id ${currentId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class RequestingDoesntExistError extends Result<ServiceError> {
		constructor(profileId: string) {
			super(false, {
				message: `The user you are requesting: ${profileId} doesn't exist or was deleted.`,
			} as ServiceError);
		}
	}

	export class RequestDoesntExistsError extends Result<ServiceError> {
		constructor() {
			super(false, {
				message: "Request doesn't already exists.",
			} as ServiceError);
		}
	}

	export class ContactAlreadyAdded extends Result<ServiceError> {
		constructor(contactId: string) {
			super(false, {
				message: `The contact: ${contactId} already added`,
			} as ServiceError);
		}
	}
}
