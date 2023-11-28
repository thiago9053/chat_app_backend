import { PrismaClient } from "@prisma/client";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { DomainEvents } from "@shared/domain/events/DomainEvents";

export const xprisma = new PrismaClient().$extends({
	model: {
		users: {
			async createWithPost(raw: any) {
				const user = await xprisma.users.create(raw);
				DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(user.userId));
			},
		},
	},
});

export type ExtendedPrismaClient = typeof xprisma;
