import { Repository } from "@prisma/client";
import { prisma } from "./prismaCli";

export class RepositoryModel {
  // create a new repository
  static addRepository = (
    mineId: string,
    url: string
  ): Promise<Repository | null> => {
    return prisma.repository.create({
      data: {
        url,
        mineId,
      },
    });
  };

  // get the existing repository
  static getRepositorybyId = (id: string): Promise<Repository | null> => {
    return prisma.repository.findUnique({
      where: {
        id,
      },
    });
  };

  // get all repository of a mine
  static getMineRepositories = (
    mineId: string
  ): Promise<Repository[] | null> => {
    return prisma.repository.findMany({
      where: {
        mineId,
      },
    });
  };
}
