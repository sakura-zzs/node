import amqplib from "amqplib";
(async () => {
  const queueName = "hello";
  // 连接队列
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, {
    durable: true,// 持久化队列
   });
  // 监听生产者发送的消息进行消费
  channel.consume(queueName, (msg) => {
    if (msg) {
      console.log(msg.content.toString());
      // 手动确认消费消息
      channel.ack(msg);
    }
  });
})()