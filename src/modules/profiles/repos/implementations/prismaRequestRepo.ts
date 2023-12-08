import { Request, RequestStatus } from "@modules/profiles/domain/request";
import { IRequestRepo } from "../requestRepo";
import { ExtendedPrismaClient } from "@shared/infra/database/prisma";
import { RequestAdapter } from "@modules/profiles/adapters/requestAdapter";
import { RequestId } from "@modules/profiles/domain/requestId";

export class PrismaRequestRepo implements IRequestRepo {
	private models: ExtendedPrismaClient;

	constructor(models: ExtendedPrismaClient) {
		this.models = models;
	}

	async exist(requesting: string, requestedBy: string): Promise<boolean> {
		const request = await this.models.requests.findFirst({
			where: {
				OR: [
					{
						requestedBy,
						requesting,
					},
					{
						requestedBy: requesting,
						requesting: requestedBy,
					},
				],
			},
		});
		return !!request;
	}

	async create(profile: Request): Promise<void> {
		const rawRequest = await RequestAdapter.toPersistence(profile);
		await this.models.requests.create({ data: rawRequest });
	}

	async updateRequest(requestId: string | RequestId, status: RequestStatus): Promise<void> {
		let rid: string;
		if (requestId instanceof RequestId) {
			rid = requestId.getStringValue();
		} else {
			rid = requestId;
		}
		await this.models.requests.update({
			where: {
				requestId: rid,
			},
			data: {
				status,
			},
		});
	}
}