/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDomainEvent } from "./IDomainEvent";

export interface IHandle<IDomainEvent> {
	setupSubscriptions(): void;
}
