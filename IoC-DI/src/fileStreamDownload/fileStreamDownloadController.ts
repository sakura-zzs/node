import type { Request, Response } from "express";
import { controller, httpPost } from "inversify-express-utils";
import path from "path";
import fs from "fs";
const fileDir = path.join(__dirname, "../../public/merges");
@controller("/")
export class FileStreamDownloadController {
  constructor() { }
  @httpPost("/fileStreamDownload")
  async fileStreamDownload(req: Request, res: Response) {
    const filename = req.body.filename;
    const file = fs.readFileSync(path.join(fileDir, filename));
    /**
     * 1.Content-Type 指定下载文件的 MIME 类型
     * application/octet-stream（二进制流数据）
     * application/pdf：Adobe PDF 文件。
     * application/json：JSON 数据文件
     * image/jpeg：JPEG 图像文件
     * 2.Content-Disposition 指定服务器返回的内容在浏览器中的处理方式。它可以用于控制文件下载、内联显示或其他处理方式
     * attachment：指示浏览器将响应内容作为附件下载。通常与 filename 参数一起使用，用于指定下载文件的名称
     * inline：指示浏览器直接在浏览器窗口中打开响应内容，如果内容是可识别的文件类型（例如图片或 PDF），则在浏览器中内联显示
     */
    // 告诉浏览器返回的是一个文件流，且将响应内容作为附件下载
    res.setHeader('Content-Type', 'application/octet-stream');
    // 对文件名进行编码，解决文件名中存在特殊字符问题
    const encodedFilename = encodeURIComponent(filename);
    res.setHeader('Content-Disposition', `attachment;filename=${encodedFilename}`);
    res.setHeader('Content-Length', file.length);
    res.send(file);
  }
}