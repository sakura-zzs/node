import amqplib from 'amqplib';
(async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange('logs', 'direct', { durable: true });
  // 声明一个队列
  const { queue } = await channel.assertQueue('queue2', { durable: true });
  // 给队列绑定交换机
  /**
   * @param {String} queue 队列名称
   * @param {String} exchange 交换机名称
   * @param {String} routingKey 路由键
   */
  // 需要绑定对应的路由键才能收到
  channel.bindQueue(queue, 'logs', 'info');
  // 消费消息
  /**
   * @param {String} queue 队列名称
   * @param {Object} options {noAck: true} 手动确认
   * @param {Function} callback 回调函数
   */
  channel.consume('queue2', (msg) => {
    console.log(msg?.content.toString()); // 收到消息
  }, {
    noAck: true,// 自动确认消息被消费
  })
})()