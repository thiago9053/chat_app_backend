import { createProfileService } from "@modules/profiles/services/profiles/createProfile";
import { AfterUserCreated } from "./afterUserCreated";

new AfterUserCreated(createProfileService);
