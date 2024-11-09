import { Repository, RepositoryStatus } from "@prisma/client";
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
  static getMineRepositories = (mineId: string): Promise<Repository[] | []> => {
    return prisma.repository.findMany({
      where: {
        mineId,
      },
    });
  };

  // update repository status
  static updateRepositoryStatus = (
    repoId: string,
    status: RepositoryStatus
  ) => {
    return prisma.repository.update({
      where: {
        id: repoId,
      },
      data: {
        repositoryStatus: status,
      },
    });
  };

  // delete repo by id
  static deleteRepositoryById = (
    repoId: string
  ): Promise<Repository | null> => {
    return prisma.repository.delete({
      where: {
        id: repoId,
      },
    });
  };
}
