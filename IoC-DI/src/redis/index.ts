import Ioredis from 'ioredis';
// 连接
const redis = new Ioredis({
  host: 'localhost',
  port: 6379,
});

//存储字符串并且设置过期时间
redis.setex('key', 10, 'value') 
//普通存储
redis.set('key', 'value')
//读取
redis.get('key')

// 集合操作
// 添加元素到集合
redis.sadd('myset', 'element1', 'element2', 'element3');

// 从集合中移除元素
redis.srem('myset', 'element2');

// 检查元素是否存在于集合中
redis.sismember('myset', 'element1')
  .then((result) => {
    console.log('Is member:', result); // true
  });

// 获取集合中的所有元素
redis.smembers('myset')
  .then((members) => {
    console.log('Members:', members);
  });

// 哈希操作
// 设置哈希字段的值
redis.hset('myhash', 'field1', 'value1');
redis.hset('myhash', 'field2', 'value2');

// 获取哈希字段的值
redis.hget('myhash', 'field1')
  .then((value) => {
    console.log('Value:', value); // "value1"
  });

// 删除哈希字段
redis.hdel('myhash', 'field2');

// 获取整个哈希对象
redis.hgetall('myhash')
  .then((hash) => {
    console.log('Hash:', hash); // { field1: 'value1' }
  });

// 列表操作
// 在队列的头部添加元素
redis.lpush('myqueue', 'element1');
redis.lpush('myqueue', 'element2');

// 获取队列中所有元素
redis.lrange('myqueue', 0, -1)
  .then((elements) => {
    console.log('Queue elements:', elements);
  });
//获取长度
redis.llen('myqueue')
  .then((length) => {
    console.log('Queue length:', length);
});

// 发布订阅
// 创建另一个 Redis 连接实例
const redis2 = new Ioredis();

// 订阅频道 'channel'
redis.subscribe('channel');

// 监听消息事件
redis.on('message', (channel, message) => {
  console.log(`Received a message from channel ${channel}: ${message}`);
});

// 发布消息到频道 'channel'
redis2.publish('channel', 'hello world');



