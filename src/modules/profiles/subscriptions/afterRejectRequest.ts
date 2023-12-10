import { RequestRejected } from "@modules/profiles/domain/events/requestRejected";
import { DeleteRequestService } from "@modules/profiles/services/requests/deleteRequest/deleteRequestService";
import { DomainEvents } from "@shared/domain/events/DomainEvents";
import { IHandle } from "@shared/domain/events/IHandle";

export class AfterRejectRequest implements IHandle<RequestRejected> {
	private deleteContactService: DeleteRequestService;

	constructor(deleteContactService: DeleteRequestService) {
		this.setupSubscriptions();
		this.deleteContactService = deleteContactService;
	}

	setupSubscriptions(): void {
		// @ts-ignore-next-line
		DomainEvents.register(this.onRequestRejected.bind(this), RequestRejected.name);
	}

	private async onRequestRejected(event: RequestRejected): Promise<void> {
		const { request } = event;

		try {
			const result = await this.deleteContactService.execute({
				requestId: request.requestId.getStringValue(),
			});

			if (result.isLeft()) {
				console.log("[RequestRejected]: " + result.value.getError().toString());
			} else {
				console.log("[RequestRejected]: Successfully executed DeleteRequest service AfterRequestRejected.");
			}
		} catch (err) {
			console.log("[RequestRejected]: Failed to execute DeleteRequest service AfterRequestRejected.");
		}
	}
}
