import amqplib from "amqplib";
(async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  // 声明交换机、使用topic主题模式
  /**
 * @param {String} exchange 交换机的名称
 * @param {String} type "direct" | "topic" | "headers" | "fanout" | "match" | 使用广播模式
 * @param {Object} options {durable: true} //开启消息持久化
 */
  await channel.assertExchange("headers", "headers", { durable: true });
  // 发送消息
  /**
 * @param {String} exchange 交换机的名称
 * @param {String} routingKey 路由键
 * @param {Buffer} content 消息内容
 * @param {Object} options {headers: {'key': 'value'}} //定义匹配规则
 */
  channel.publish("headers", "", Buffer.from("Hello World!-abc"), { headers: { hello: 'abc' } });
  channel.publish("headers", "", Buffer.from("Hello World!-abb"), { headers: { hello1: 'abb' } });
  channel.publish("headers", "", Buffer.from("Hello World!-bbb"), { headers: { hello2: 'bbb' } });
  // 关闭连接
  await channel.close();
  await connection.close();
  process.exit(0);
})()