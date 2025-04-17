import jsonwebtoken from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import {injectable} from 'inversify'

@injectable()
export class JWT{
  private secret = 'kuroneko'
  private jwtOptions = {
    // 提取token,自动从请求头中获取
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.secret
  }

  constructor() {
    this.init()
  }

  // 初始化jwt
  public init() {
    // 生成jwt验证策略
    const strategy= new Strategy(this.jwtOptions, (payload, done) => {
      return done(null, payload)
    })
    // 通过passport来使用这个策略进行验证
    passport.use(strategy)
  }

  // 验证
  public authenticate() {
    return passport.authenticate('jwt', { session: false })
  }

  // 生成token
  public generateToken(payload: any) {
    return jsonwebtoken.sign(payload, this.secret, { expiresIn: '1h' })
  }

  // 初始化passport
  public initialize() {
    return passport.initialize()
  }
}