import { prisma } from "@shared/infra/database/prisma";
import { PrismaProfileRepo } from "./implementations/prismaProfileRepo";
import { PrismaRequestRepo } from "./implementations/prismaRequestRepo";

const profileRepo = new PrismaProfileRepo(prisma);
const requestRepo = new PrismaRequestRepo(prisma);

export { profileRepo, requestRepo };
