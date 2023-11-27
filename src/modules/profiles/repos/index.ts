import { prisma } from "@shared/infra/database/prisma";
import { PrismaProfileRepo } from "./implementations/prismaProfileRepo";

const profileRepo = new PrismaProfileRepo(prisma);

export { profileRepo };
