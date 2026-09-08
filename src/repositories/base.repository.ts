import { prisma } from "@/lib/prisma";

export abstract class BaseRepository {
  protected readonly db = prisma;
}
