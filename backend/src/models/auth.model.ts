import { User } from "@prisma/client";
import { prisma } from "./prismaCli";

export class AuthModel {
  static createUser = (
    username: string,
    email: string,
    password: string
  ): Promise<User | null> => {
    return prisma.user.create({
      data: {
        username,
        email,
        password,
        status: true,
      },
    });
  };

  static findUserByEmail = (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  };

  static getUserById = (userId: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  };
}
