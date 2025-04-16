import 'reflect-metadata';
import express from "express";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { PrismaClient } from "../generated/prisma";
import { PrismaDb } from "./db";
import { UserController } from "./user/controller";
import { UserService } from "./user/service";

//创建IoC容器
const container = new Container();

// 用PrismaClient这个字符串作为标识符来绑定prisma，在需要注入依赖的类中，使用 @inject 注入这个依赖
// 也可以使用类或symbol来作为标识符
// 需要将绑定类型从 PrismaClient 改为 () => PrismaClient ，这表示我们绑定的是一个返回 PrismaClient 的工厂函数
container
  .bind<PrismaClient>("PrismaClient")
  .toFactory(() => {
    return () => {
      return new PrismaClient();
    }
  });
  // toSelf是to的简写
container.bind(PrismaDb).toSelf();
// 绑定控制器和服务
container.bind('UserController').to(UserController);
container.bind('UserService').to(UserService);

//创建集成了依赖注入的express服务器
/**
 * 1.整合依赖注入
 * 通过 container 参数将 InversifyJS 的依赖注入容器与 Express 路由系统连接，使 Express 控制器（Controllers）的实例化过程由 InversifyJS 管理。
 * 2.自动注册路由
 * 扫描所有被 @controller 装饰器标记的类，将其转换为 Express 路由（如 @Get('/users') 会生成 /users 的 GET 路由）。
 * 3.中间件配置入口
 * 提供 setConfig 方法，允许添加 Express 中间件（如 JSON 解析、CORS 等）。
 */
const server = new InversifyExpressServer(container);
// 注册中间件
server.setConfig((app) => {
  app.use(express.json());
});
// 这里的app就是express
const app = server.build();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
