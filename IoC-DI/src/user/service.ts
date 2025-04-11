import { injectable,inject } from 'inversify';
import { PrismaDb } from '../db';
// 标记为可注入
@injectable()
export class UserService{
  constructor(@inject(PrismaDb) private ) { }
 }