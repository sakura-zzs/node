import 'reflect-metadata';
import express from "express";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { PrismaClient } from "../generated/prisma";
import { PrismaDb } from "./db";
import { UserController } from "./user/controller";
import { LargeFileUploadController } from './largeFileUpload/largeFileUploadController';
import { FileStreamDownloadController } from './fileStreamDownload/fileStreamDownloadController';
import { HttpCacheController } from './httpCache/httpCacheController';
import { UserService } from "./user/service";
import { ShortLinkCreateController } from './shortLinkCreate/shortLinkCreateController';
import { ShortLinkCreateService } from './shortLinkCreate/shortLinkCreateService';
import { JWT } from './jwt';
import { ScanCodeLoginController } from './scanCodeLogin/scanCodeLoginController';
import { Server } from 'socket.io';
import http from 'http';

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
container.bind('LargeFileUploadController').to(LargeFileUploadController);
container.bind('FileStreamDownloadController').to(FileStreamDownloadController);
container.bind('HttpCacheController').to(HttpCacheController);
container.bind('UserService').to(UserService);
container.bind('ShortLinkCreateController').to(ShortLinkCreateController);
container.bind('ShortLinkCreateService').to(ShortLinkCreateService);
container.bind('ScanCodeLoginController').to(ScanCodeLoginController);

// 绑定jwt
container.bind(JWT).toSelf();

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
  app.use(express.static('public'))
  // 通过获取容器中的JWT实例初始化passport
  app.use(container.get(JWT).initialize())
  // 允许跨域
  app.use('*',(req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next()
  })
});
// 这里的app就是express
const app = server.build();
// socket.io需要一个http.Server 实例，我们需要通过http模块创建服务
const httpServer = http.createServer(app);
// 创建socket.io实例
const io = new Server(httpServer, {
  // 允许跨域
  cors:{
    origin:'*'
  }
})
// 用户列表
const groupList = {}
// 监听连接事件
io.on('connection', (socket) => {
  // 监听加入房间事件
  socket.on('join', ({ name, room }) => {
    // 将用户加入指定房间
    socket.join(room)
    // 记录信息
    if(!groupList[room]){
      groupList[room] = [{name,room,id:socket.id}]
    } else {
      groupList[room].push({name,room,id:socket.id})
    }
    // 发送用户进入房间信息
    socket.emit('message', { name: '管理员', text: `${name}进入了房间` })
    // 发送房间用户列表给当前用户（更新当前用户）
    socket.emit('groupList', groupList)
    // 将消息广播给除了发送者以外的所有已连接的客户端（更新其他用户）
    socket.broadcast.emit('groupList', groupList)
  })
  // 监听消息事件
  socket.on('message', ({ text, name, room }) => {
    console.log('收到消息', text, name, room);
    // 将消息发送给指定房间中的所有客户端， 但不包括发送者自己 
    // socket.to向指定房间的所有客户端发送消息，但不包括发送者自己
    socket.broadcast.to(room).emit('message', { name, text })
  })
  socket.on('disconnect', () => {
    Object.keys(groupList).forEach(key => {
      // 获取到离开的用户
      let leaver = groupList[key].find(item => item.id === socket.id)
      // 广播给对应房间
      if (leaver) {
        socket.broadcast.to(leaver.room).emit('message', { name: '管理员', text: `${leaver.name}离开了房间` })
      }
      // 删除用户
      groupList[key] = groupList[key].filter(item => item.id !== socket.id)
    })
    // 更新房间列表
    socket.broadcast.emit('groupList', groupList)
  });
});
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
