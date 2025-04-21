import { inject } from "inversify";
import { controller,httpGet,httpPost } from "inversify-express-utils";
import { UserService } from "./service";
import type { Request, Response } from "express"
import Ioredis from "ioredis";
import { JWT } from "../jwt";
import fs from 'node:fs'
import { join } from "path";
// 读取lua脚本
const script = fs.readFileSync(join(__dirname,'../lua/lottery.lua'), 'utf-8');
// 实例化redis客户端
// const redis = new Ioredis({
//   port: 6379,
//   host: 'localhost',
// });
// 过期时间，控制限流阀的持续时间，实际上是通过这个时间让redis的key过期的，然后重置，单位秒
const TIME = 30
// TIME时间内的点击上限
const CHAGE = 5
// 限流阀的key
const key='lottery'

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
  // 模拟抽奖限流阀，30s内点击超过5次就提示重试
  // @httpGet('/lottery')
  // public async lottery(req: Request, res: Response) {
  //   // 使用redis的eval命令执行lua脚本进行限流阀操作，达到上限提示操作频繁
  //   /**
  //    * redis.eval 第一个参数就是lua的代码我们用fs读取了它
  //    * 第二个参数是key的数量我们有1个
  //    * 第三个参数就是key，通过key给redis读写
  //    * 第四个是arguments
  //    * 第五个也是arguments
  //    * 第六个是个回调成功的失败，成功会接受返回值
  //    */
  //   redis.eval(script, 1, key,CHAGE,TIME, (err, result) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       result === 1 ? res.send('操作频繁') : res.send('抽奖成功')
  //     }
  //   });
  // }
}