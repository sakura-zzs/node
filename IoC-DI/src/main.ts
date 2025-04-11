import 'reflect-metadata'
import express from 'express'
import { Container } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'

//创建IoC容器
const container = new Container()

//创建集成了依赖注入的express服务器
/**
 * 1.整合依赖注入
 * 通过 container 参数将 InversifyJS 的依赖注入容器与 Express 路由系统连接，使 Express 控制器（Controllers）的实例化过程由 InversifyJS 管理。
 * 2.自动注册路由
 * 扫描所有被 @controller 装饰器标记的类，将其转换为 Express 路由（如 @Get('/users') 会生成 /users 的 GET 路由）。
 * 3.中间件配置入口
 * 提供 setConfig 方法，允许添加 Express 中间件（如 JSON 解析、CORS 等）。
 */
const server = new InversifyExpressServer(container)
// 注册中间件
server.setConfig((app) => {
  app.use(express.json())
})
// 这里的app就是express
const app = server.build()
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})