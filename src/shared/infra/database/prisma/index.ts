import { PrismaClient } from "@prisma/client";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { DomainEvents } from "@shared/domain/events/DomainEvents";

export const prisma = new PrismaClient().$extends({
	model: {
		users: {
			async createWithPre(raw: any) {
				const user = await prisma.users.create(raw);
				DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(user.userId));
			},
		},
	},
});

export type ExtendedPrismaClient = typeof prisma;
