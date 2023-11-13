import { RefreshAccessTokenService } from "./refreshAccessTokenService";
import { BaseController } from "@shared/infra/controller/BaseController";
import { Request, Response } from "express";
import { RefreshAccessTokenDTO } from "./refreshAccessTokenDTO";
import { RefreshAccessTokenErrors } from "./refreshAccessTokenErrors";
import { AccessToken } from "@modules/auth/domain/jwt";
import { LoginDTOResponse } from "@modules/users/services/login/loginResponse";

export class RefreshAccessTokenController extends BaseController {
	private service: RefreshAccessTokenService;

	constructor(service: RefreshAccessTokenService) {
		super();
		this.service = service;
	}

	async executeImpl(req: Request, res: Response): Promise<any> {
		const dto: RefreshAccessTokenDTO = req.body as RefreshAccessTokenDTO;

		try {
			const result = await this.service.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case RefreshAccessTokenErrors.RefreshTokenNotFound:
						return this.notFound(res, error.getError().message);
					case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
						return this.notFound(res, error.getError().message);
					default:
						return this.fail(res, error.getError() as Error);
				}
			} else {
				const accessToken: AccessToken = result.value.getValue() as AccessToken;
				return this.ok<LoginDTOResponse>(res, {
					refreshToken: dto.refreshToken,
					accessToken: accessToken,
				});
			}
		} catch (err) {
			return this.fail(res, err as string | Error);
		}
	}
}
