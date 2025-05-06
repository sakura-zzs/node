import {inject} from "inversify";
import type { Request, Response } from "express";
import { controller, httpGet,httpPost } from "inversify-express-utils";
import {JWT} from '../jwt'
import qrcode from 'qrcode'
let user = {}
// 模拟用户
let userId=1
@controller('/scl')
export class ScanCodeLoginController {
  constructor(@inject(JWT) private jwt: JWT) { }
  // 生成二维码
  @httpGet('/qrcode')
  public async getQrCode(req: Request, res: Response) {
    // 初始化用户信息用于记录用户和二维码创建时间
    user[userId]={
      token:null,
      createTime:Date.now()
    }
    const code =await qrcode.toDataURL(`http://192.168.0.50:3001/scanCodeLogin/mandate.html?userId=${userId}`)
    res.json({
      code,userId
    })
  }
  // 验证二维码，授权
  @httpPost('/login/:userId')
  public login(req: Request, res: Response) { 
    const { userId } = req.params
    //登录授权通过返回token并记录用户信息
    const token = this.jwt.generateToken({ userId })
    user[userId].token = token
    user[userId].createTime = Date.now()
    res.json({
      token
    })
  }
  // 轮询是否授权（对应userId是否存在token以及是否过期）
  @httpGet('/check/:userId')
  public check(req: Request, res: Response) {
    const { userId } = req.params
    // 超时
    if(Date.now()-user[userId].createTime>1000*60*1){
      res.json({
        code:401,
        msg:'登录超时'
      })
      return
    }
    // 未授权
    if(!user[userId].token){
      res.json({
        code:401,
        msg:'未授权'
      })
      return
    }else{
      res.json({
        code:200,
        msg:'授权成功',
      })
    }
  }
}