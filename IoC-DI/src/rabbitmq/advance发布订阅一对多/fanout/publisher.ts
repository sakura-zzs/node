import amqplib from "amqplib";
(async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  // 声明交换机、使用direct直连模式
  /**
 * @param {String} exchange 交换机的名称
 * @param {String} type "direct" | "topic" | "headers" | "fanout" | "match" | 使用广播模式
 * @param {Object} options {durable: true} //开启消息持久化
 */
  await channel.assertExchange("fanout", "fanout", { durable: true });
  // 发送消息
  /**
 * @param {String} exchange 交换机的名称
 * @param {String} routingKey 路由键,使用广播模式时，路由键为空字符串
 * @param {Buffer} content 消息内容
 */
  channel.publish("fanout", "", Buffer.from("Hello World!"));
  // 关闭连接
  await channel.close();
  await connection.close();
  process.exit(0);
})()