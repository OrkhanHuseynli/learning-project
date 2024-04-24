import { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/prisma.client";

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma: prisma,
};

export class AppContext implements Context {
  private static instance: AppContext;
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AppContext {
    if (this.instance == null) {
      this.instance = new AppContext();
    }
    return this.instance;
  }

  public static getPrisma(): PrismaClient {
    return this.getInstance().prisma
  }
}
