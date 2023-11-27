import { createProfileService } from "@modules/profiles/services/createProfile";
import { AfterUserCreated } from "./afterUserCreated";

new AfterUserCreated(createProfileService);
