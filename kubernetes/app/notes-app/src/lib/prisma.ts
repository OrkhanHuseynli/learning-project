import { PrismaClient } from "@prisma/client";

if(process.env.DATABASE_URL){
  console.log("DATABASE_URL FROM PRISMA : ", process.env.DATABASE_URL);
}else{
  console.log("DATABASE_URL FROM PRISMA IS NOT DEFINED : ", process.env.DATABASE_URL);
}
const prisma: PrismaClient = new PrismaClient();

export default prisma;
