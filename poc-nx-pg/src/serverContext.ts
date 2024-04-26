import { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/prisma.client";

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma: prisma,
};

export class AppServerContext implements Context {
  private static instance: AppServerContext;
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AppServerContext {
    if (this.instance == null) {
      this.instance = new AppServerContext();
    }
    return this.instance;
  }

  public static getPrisma(): PrismaClient {
    return this.getInstance().prisma;
  }
}
