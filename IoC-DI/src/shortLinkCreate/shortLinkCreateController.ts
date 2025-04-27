import { controller,httpPost } from "inversify-express-utils";
import type { Request, Response } from "express";

@controller("/shortLink")
export class ShortLinkCreateController  {
  public async create(req: Request, res: Response) {
    res.send("Hello World!");
  }
}