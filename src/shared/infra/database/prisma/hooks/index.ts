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
		requests: {
			async updateWithPost(opts: any) {
				const request = await xprisma.requests.update(opts);
				if (opts.data.status === "Accepted")
					DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(request.requestId));
				if (opts.data.status === "Rejected")
					DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(request.requestId));
			},
		},
	},
});

export type ExtendedPrismaClient = typeof xprisma;
