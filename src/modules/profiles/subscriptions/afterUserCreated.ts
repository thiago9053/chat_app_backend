import { IHandle } from "@shared/domain/events/IHandle";
import { DomainEvents } from "@shared/domain/events/DomainEvents";
import { UserCreated } from "@modules/users/domain/events/userCreated";
import { CreateProfileService } from "@modules/profiles/services/createProfile/createProfileService";
import { CreateProfileDTO } from "@modules/profiles/services/createProfile/createProfileDTO";

export class AfterUserCreated implements IHandle<UserCreated> {
	private createProfileService: CreateProfileService;

	constructor(createProfileService: CreateProfileService) {
		this.setupSubscriptions();
		this.createProfileService = createProfileService;
	}

	setupSubscriptions(): void {
		// @ts-ignore-next-line
		DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name);
	}

	private async onUserCreated(event: UserCreated): Promise<void> {
		console.log("b");
		const { user } = event;
		console.log(user.userId.getStringValue());
		try {
			const result = await this.createProfileService.execute({
				userId: user.userId.getStringValue(),
			} as CreateProfileDTO);
			if (result.isLeft()) {
				console.log("[AfterUserCreated]: " + result.value.getError().toString());
			} else {
				console.log("[AfterUserCreated]: Successfully executed CreateProfile service AfterUserCreated");
			}
		} catch (err) {
			console.log("[AfterUserCreated]: Failed to execute CreateProfile service AfterUserCreated.");
		}
	}
}
