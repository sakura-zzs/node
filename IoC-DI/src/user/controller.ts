import { inject } from "inversify";
import { controller,httpGet } from "inversify-express-utils";
import { UserService } from "./service";
import type {Request,Response} from "express"
// 在这里通过类装饰器拿到getUser的元数据进行路由注册
@controller('/user')
export class UserController{
  // 通过依赖注入获取 UserService 实例（标识符为 'UserService'）
  constructor(@inject('UserService') private userService: UserService) { }
  // 所以在这里是通过httpGet这个方法装饰器来为getUser这个路由处理函数设置元数据的
  @httpGet('/')
  public async getUser(req: Request, res: Response) {
    // return await this.userService.getUser()
  }
}