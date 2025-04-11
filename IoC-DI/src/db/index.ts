import { injectable,inject } from "inversify";
import { PrismaClient } from "../../generated/prisma";
@injectable()
export class PrismaDb{
  prisma:PrismaClient
  constructor(@inject('PrismaClient') PrismaClient: () => PrismaClient) {
    this.prisma = PrismaClient()
   }
}