import { inject } from "inversify";
import { controller,httpGet,httpPost } from "inversify-express-utils";
import { UserService } from "./service";
import type { Request, Response } from "express"
import { JWT } from "../jwt";
// 获取jwt的验证中间件
const {authenticate} = new JWT()
// 在这里通过类装饰器拿到getUser的元数据进行路由注册
@controller('/user')
export class UserController{
  // 通过依赖注入获取 UserService 实例（标识符为 'UserService'）
  constructor(@inject('UserService') private userService: UserService) { }
  // 所以在这里是通过httpGet这个方法装饰器来为getUser这个路由处理函数设置元数据的
  @httpGet('/index',authenticate())
  public async getUser(req: Request, res: Response) {
    const data = await this.userService.getUser()
    res.send(data)
  }

  @httpPost('/create')
  public async createUser(req: Request, res: Response) {
    const data = await this.userService.createUser(req.body)
    res.send(data)
  }
}