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
		await this.models.requests.updateWithPost({
			where: {
				requestId: rid,
			},
			data: {
				status,
			},
		});
	}

	async getRequestByRequetsId(requestId: string): Promise<Request> {
		const request = await this.models.requests.findUnique({
			where: {
				requestId,
			},
		});
		if (!request) throw new Error("Request not found.");
		return RequestAdapter.toDomain(request);
	}

	async delete(requestId: string): Promise<void> {
		await this.models.requests.delete({
			where: {
				requestId,
			},
		});
	}

	async list(userId: string): Promise<Request[]> {
		const requests = await this.models.requests.findMany({
			where: {
				AND: [
					{
						requesting: userId,
					},
					{ status: "Pending" },
				],
			},
		});
		let result: Request[] = [];
		for (let i = 0; i < requests.length; i++) {
			const domain = await RequestAdapter.toDomain(requests[i]);
			result.push(domain);
		}
		return result;
	}
}
