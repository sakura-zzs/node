import http2 from 'node:http2'
import fs from 'node:fs'
import path from 'node:path'
const certDir=path.join(__dirname,'../../public/cert')
const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(certDir,'server.key')),
  cert: fs.readFileSync(path.join(certDir,'server.crt')),
})

server.on('stream', (stream, headers) => {
  
  stream.respond({
    'content-type': 'text/html',
    ':status': 200,
  })
  server.on('error', (err) => {
    console.error(err)
  })
  stream.end('<h1>Hello http2!</h1>')
})

server.listen(80, () => {
  console.log('server is running on port 80')
})