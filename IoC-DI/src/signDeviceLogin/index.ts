import express from "express";
import { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());
app.use(express.static('public'));
// 存储ws连接实例和浏览器指纹
const connections={}
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
// 创建ws服务器
const wss = new WebSocketServer({server});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.action === 'login') {
      // 已经登录过的用户，判断浏览器指纹是否一致，如果不一致，关闭连接，更新为新设备登录
      if (connections[data.id] && connections[data.id].fingerprint === data.fingerprint) {
        console.log('账号在别处登录')
        // 提示旧设备已下线
        connections[data.id].socket.send(JSON.stringify({
          action: 'logout',
          status: 'error',
          message: `你于${new Date().toLocaleString()}在另一台设备登录，当前设备已下线`
        }))
        connections[data.id].socket.close()
        connections[data.id].socket = ws
      }
      else {
        // 首次登录进行记录
        console.log('首次登录')
        connections[data.id] = {
          socket: ws,
          fingerprint: data.fingerprint
        }
      }
    }
  });
})