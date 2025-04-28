import { PrismaDb } from "../db";
import { injectable, inject } from "inversify";
import shortid from "shortid";
@injectable()
export class ShortLinkCreateService {
  constructor(@inject(PrismaDb) private prismaDb: PrismaDb) { }

   async createShortLink(data: any) {
    // 生成短码，将短码和对应的长链接存入数据库
    return await this.prismaDb.prisma.short.create({
      data: {
        short_id: shortid.generate(),
        url: data.url
      }
    })
  }
   async getShortLink(short_id: string) {
    // 通过短码查询对应的长链接
    return await this.prismaDb.prisma.short.findUnique({
      where: {
        short_id
      }
    })
  }
}