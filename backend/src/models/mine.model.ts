import { Mine } from "@prisma/client";
import { prisma } from "./prismaCli";

export class MineModel {
  // create a mine
  static createMine = (userId: string, mineName: string): Promise<Mine> => {
    return prisma.mine.create({
      data: {
        name: mineName,
        userId: userId,
      },
    });
  };

  // get mines by userId and username
  static getUsersMineByName = (
    userId: string,
    mineName: string
  ): Promise<Mine | null> => {
    return prisma.mine.findFirst({
      where: {
        userId: userId,
        name: { equals: mineName },
      },
    });
  };

  // get all mines of a user
  static getAllMines = (userId: string): Promise<Mine[] | null> => {
    return prisma.mine.findMany({
      where: { userId: userId },
    });
  };
}
