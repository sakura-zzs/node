import { injectable, inject } from 'inversify';
import { PrismaDb } from '../db';
// 使用dto验证库来校验
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto } from './user.dto';
import { JWT } from '../jwt';
// 标记为可注入
@injectable()
export class UserService {
  constructor(
    @inject(PrismaDb) private readonly PrismaDb: PrismaDb,
    @inject(JWT) private readonly JWT: JWT
  ) { }
  async getUser() {
    const user = await this.PrismaDb.prisma.users.findMany();
    return user;
  }

  async createUser(data: UserDto) {
    // 将对象转为类用于dto验证
    const userDto = plainToClass(UserDto, data);
    // 校验
    const errors = await validate(userDto);
    // 错误信息
    const dto = []
    if (errors.length) {
      errors.forEach(error => {
        Object.keys(error.constraints).forEach(key => {
          dto.push({
            [error.property]: error.constraints[key]
          })
        })
      })
      return dto

    } else {
      const userInfo = await this.PrismaDb.prisma.users.create({
        data: userDto
      })
      // 返回token
      return {
        userInfo,
        token:this.JWT.generateToken(userInfo)
      }
    }
  }
}