// 数据校验
import { IsNotEmpty, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserDto{
  @IsNotEmpty({ message: '用户名不能为空' })
  @Transform(({ value }) => value.trim())
  name: string
  
  @IsNotEmpty({ message: '密码不能为空' })
  @IsEmail({},{ message: '邮箱格式不正确' })
  @Transform(({ value }) => value.trim())
  email: string
}