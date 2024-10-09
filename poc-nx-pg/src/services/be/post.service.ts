import { PrismaClient } from "@prisma/client";
import { prisma } from "prisma/prisma.client";

export class PostService {
  prisma: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getPosts(skip: number) {
    const posts = await prisma.post.findMany({
      skip: skip,
      take: Number(30),
      orderBy: {
        title: "desc",
      },
    });

    return posts;
  }
}
