import { controller, httpPost } from 'inversify-express-utils';
import type { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// 确保目录存在
const uploadDir = path.join(__dirname, '../../public/uploads');
const mergedDir = path.join(__dirname, '../../public/merges');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(mergedDir)) {
  fs.mkdirSync(mergedDir, { recursive: true });
}

// 使用 multer.memoryStorage() 先将文件保存在内存中
const upload = multer({ storage: multer.memoryStorage() });

@controller('/largeFileUpload')
export class LargeFileUploadController {
  constructor() { }
  
  @httpPost('/upload', upload.single('file'))
  public async upload(req: Request, res: Response) {
    // 在这里可以安全地访问 req.body
    if (!req.file || !req.body.index || !req.body.filename) {
      return res.status(400).send('缺少必要参数');
    }
    
    // 手动保存文件,如果使用multer.diskStorage()保存文件，那么diskStorage中会解析不到req.body
    const fileName = `${req.body.index}-${req.body.filename}`;
    fs.writeFileSync(path.join(uploadDir, fileName), req.file.buffer);
    
    res.send('success');
  }
  
  // 合并文件
  @httpPost('/merge')
  public async merge(req: Request, res: Response) {
    let files = fs.readdirSync(uploadDir);
    // 按索引排序，确保合并顺序正确
    files = files.sort((a, b) => {
      return parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]);
    });
    
    // 通过appendFileSync写入
    if (fs.existsSync(path.join(mergedDir, req.body.filename + '.mp4'))) {
      // 删除已存在的文件
      fs.unlinkSync(path.join(mergedDir, req.body.filename+'.mp4'));
    }
    files.forEach(file => {
      fs.appendFileSync(path.join(mergedDir, req.body.filename+'.mp4'), fs.readFileSync(path.join(uploadDir, file)));
      // 删除上传的文件
      fs.unlinkSync(path.join(uploadDir, file));
    });
    
    res.send('success');
  }
}