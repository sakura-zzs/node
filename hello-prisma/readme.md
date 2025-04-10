坑点
prisma 是用来生成prisma项目的cli，执行npx prisma init初始化prisma项目，它会生成prisma.schema文件，这个文件是prisma的配置文件，里面有数据库的配置信息，以及模型定义。
还会生成.env文件，这个文件是环境变量文件，里面有数据库的连接信息。
npx prisma migrate dev --name init，这个命令会生成一个migration文件夹，里面有一个init.sql文件，这个文件是数据库的迁移文件，里面有数据库的表定义。
它会根据prisma.schema文件生成数据库的表定义,还会自动执行prisma generate
而安装完的@prisma/client，在执行prisma generate时，会生成一个prisma文件夹，里面有一个client文件夹，里面有一个index.d.ts文件，这个文件是prisma的类型定义文件，里面有数据库的表定义。
在generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma" //生成的prisma/client的位置
}
我们需要使用生成的prisma客户端目录来引入prisma客户端
import { PrismaClient } from './generated/prisma'
