import NodeClam from 'clamscan';
const clam = new NodeClam().init({
  scanRecursively: true, //深度扫毒
    clamdscan: {
        port: 3310, //连接引擎的端口 端口配置项在这个文件 clamd.conf 默认3310
        host: 'localhost', //连接引擎的IP 
    },
    clamscan: {
        scanArchives: true, //扫描归档文件
        scanFiles: true, //扫描文件
    }
});
clam.then((clamscan) => {
  //批量扫描文件
  clamscan.scanFiles(['./index.ts', './package.json','./pnpm-lock.yaml'], (err, goodfiles, badfiles) => {
      if (err) {
          console.log(err)
      } else {
          console.log('扫描完成')
          //goodfiles 就是没问题的文件
          //badfiles 就是病毒文件
          console.log(goodfiles, badfiles)
      }
  })
  // clamscan.scanDir 这个方法windows用不了只能在linux用
  // //扫描目录
  // clamscan.scanDir('./', (err, goodfiles, badfiles) => {
  //     if (err) {
  //         console.log(err)
  //     } else {
  //         console.log('扫描完成')
  //         console.log(goodfiles, badfiles)
  //     }
  // })
  //检查是否是病毒文件
  clamscan.isInfected('./index.ts', (err, result) => {
      if (err) {
          console.log(err)
      } else {
          console.log(result)
      }
  })
})