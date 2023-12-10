import { RequestAccepted } from "@modules/profiles/domain/events/requestAccepted";
import { AddContactDTO } from "@modules/profiles/services/contacts/addContact/addContactDTO";
import { AddContactService } from "@modules/profiles/services/contacts/addContact/addContactService";
import { DomainEvents } from "@shared/domain/events/DomainEvents";
import { IHandle } from "@shared/domain/events/IHandle";

export class AfterAcceptRequest implements IHandle<RequestAccepted> {
	private addContactService: AddContactService;

	constructor(addContactService: AddContactService) {
		this.setupSubscriptions();
		this.addContactService = addContactService;
	}

	setupSubscriptions(): void {
		// @ts-ignore-next-line
		DomainEvents.register(this.onRequestAccepted.bind(this), RequestAccepted.name);
	}

	private async onRequestAccepted(event: RequestAccepted): Promise<void> {
		const { request } = event;

		try {
			const addContactInCurrentProfileResult = await this.addContactService.execute({
				currentProfileId: request.requestedBy.getStringValue(),
				contactId: request.requesting.getStringValue(),
			} as AddContactDTO);
			const addContactInRequestingProfileResult = await this.addContactService.execute({
				currentProfileId: request.requesting.getStringValue(),
				contactId: request.requestedBy.getStringValue(),
			} as AddContactDTO);

			if (addContactInCurrentProfileResult.isLeft()) {
				console.log("[RequestAccepted]: " + addContactInCurrentProfileResult.value.getError().toString());
			} else if (addContactInRequestingProfileResult.isLeft()) {
				console.log("[RequestAccepted]: " + addContactInRequestingProfileResult.value.getError().toString());
			} else {
				console.log("[RequestAccepted]: Successfully executed AddContact service AfterRequestAccepted.");
			}
		} catch (err) {
			console.log("[RequestAccepted]: Failed to execute AddContact service AfterRequestAccepted.");
		}
	}
}
