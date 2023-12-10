import { DeleteRequestService } from "./deleteRequestService";
import { requestRepo } from "@modules/profiles/repos";

export const deleteRequestService = new DeleteRequestService(requestRepo);
