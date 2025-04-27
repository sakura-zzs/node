import type { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import fs from 'fs'
import crypto from 'node:crypto'
@controller("/httpCache")
export class HttpCacheController {
  constructor() { }
  // 通过Expires头设置强缓存过期时间
  @httpGet("/expires")
  public async get(req: Request, res: Response) {
    res.setHeader("Expires", new Date(Date.now() + 1000 * 60 * 60).toUTCString());
    res.json({
      name: 'cache',
      version: '1.0.0'
    })
  }
  // 通过Cache-Control头设置强缓存过期时间
  @httpGet("/cacheControl")
  public async cacheControl(req: Request, res: Response) {
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({
      name: 'cache',
      version: '1.0.0'
    })
  
  }
  //通过Last-Modified和If-Modified-Since头设置协商缓存
  @httpGet("/lastModified")
  public async lastModified(req: Request, res: Response) {
    res.setHeader("Cache-Control", "no-cache, max-age=2592000")//表示走协商缓存
    // 获取上一次修改时间（上一次服务器给客户端的修改时间）
    const lastModified = req.headers['if-modified-since'];
    // 获取当前修改时间
    const modifiedTime = fs.statSync('./src/httpCache/httpCacheController.ts').mtime.toISOString()
    res.setHeader("Last-Modified", modifiedTime);
    // 如果上一次修改时间和当前修改时间相同，则表示没有修改，返回304,否则返回新值
    if(lastModified&& lastModified === modifiedTime){
      res.status(304).end()
    } else {
      res.json({
        name: 'cache',
        version: '1.0.0'
      })
    }
  }
  // 通过ETag和If-None-Match头设置协商缓存 
  @httpGet("/eTag")
  public async eTag(req: Request, res: Response) {
    res.setHeader("Cache-Control", "no-cache, max-age=2592000")//表示走协商缓存
    // 生成ETag标识符
    const etag = crypto.createHash('sha256').update(fs.readFileSync('./src/httpCache/httpCacheController.ts')).digest('hex')
    // 获取上一次的ETag标识符
    const ifNoneMatch = req.headers['if-none-match'];
    // 如果ETag标识符相同，则表示没有修改，返回304,否则返回新值并更新etag
    if(ifNoneMatch&& ifNoneMatch === etag){
      res.status(304).end()
    }
    res.setHeader("ETag", etag)
    res.json({
      name: 'cache',
      version: '1.0.0'
    })
  }
}