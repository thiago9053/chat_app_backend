export interface Service<IRequest, IResponse> {
	execute(request?: IRequest): Promise<IResponse> | IResponse;
}
