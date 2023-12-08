import { GetUserByUserNameService } from "@modules/users/services/getUserByUserName/getUserByUserNameService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { DecodedExpressRequest } from "@modules/auth/models/decodedRequest";
import { Response } from "express";
import { UserAdapter } from "@modules/users/adapters/userAdapter";
import { GetProfileByUserNameService } from "@modules/profiles/services/profiles/getProfileByUserName/getProfileByUserNameService";
import { ProfileAdapter } from "@modules/profiles/adapters/profileAdapter";

export class GetCurrentUserController extends BaseController {
	private service: GetUserByUserNameService;
	private profileService: GetProfileByUserNameService;

	constructor(service: GetUserByUserNameService, profileService: GetProfileByUserNameService) {
		super();
		this.service = service;
		this.profileService = profileService;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { username } = req.decoded;

		try {
			const userResult = await this.service.execute({ username });
			const profileResult = await this.profileService.execute({ username });

			if (userResult.isLeft()) {
				return this.fail(res, userResult.value.getError().message);
			}
			if (profileResult.isLeft()) {
				return this.fail(res, profileResult.value.getError().message);
			}
			const user = userResult.value.getValue();
			const profile = profileResult.value.getValue();
			return this.ok(res, {
				user: UserAdapter.toDTO(user),
				profile: ProfileAdapter.toDTO(profile),
			});
		} catch (err) {
			return this.fail(res, err as Error | string);
		}
	}
}
