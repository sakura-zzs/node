import { controller,httpGet,httpPost } from "inversify-express-utils";
import type { Request, Response } from "express";
import { ShortLinkCreateService } from "./shortLinkCreateService";
import { inject } from "inversify";
@controller("/shortLink")
export class ShortLinkCreateController  {
  constructor(
    @inject('ShortLinkCreateService') private shortLinkCreateService: ShortLinkCreateService
  ) { }
  @httpPost("/create")
  public async create(req: Request, res: Response) {
    const shortLink = await this.shortLinkCreateService.createShortLink(req.body);
    console.log(shortLink);
    res.send(`http://localhost:3000/shortLink/${shortLink.short_id}`);
  }
  @httpGet("/:short_id")
  public async get(req: Request, res: Response) {
    const short_id = req.params.short_id
    const shortLink = await this.shortLinkCreateService.getShortLink(short_id);
    console.log(shortLink);
    if (shortLink && shortLink.url) {
      // 重定向到长链接
      res.redirect(shortLink.url);
    } else {
      res.send("短链接不存在");}
  }
}