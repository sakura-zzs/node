import amqplib from "amqplib";
(async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  /*
   * 使用新增的延时类型切换一下type类型 x-delayed-message
   * 连接交换机的时候增加arguments对象 添加 x-delayed-type 目标交换机类型 这儿使用direct
   * 发布消息的时候增加头部信息 x-delay:延时的时间(毫秒)
  */
  /**
 * @param {String} exchange 交换机的名称
 * @param {string} type 交换机类型 direct fanout topic headers x-delayed-message
 * @param {options} options 可选配置项
 */
  //这个方法就是说如果你创建过这个交换机就不会再创建了 如果没有创建过这个交换机就会创建
  await channel.assertExchange("delay", "x-delayed-message", {
    arguments: {
    'x-delayed-type': 'direct' //目标交换机类型
    }
  });
  // 发送消息
  /**
 * @param {String} exchange 交换机的名称
 * @param {String} routingKey 路由键,使用广播模式时，路由键为空字符串
 * @param {Buffer} content 消息内容
 * @param {options} options 可选配置项 
 */
  channel.publish("delay", "time", Buffer.from("Delay Hello World!"),{
    headers:{
        'x-delay': 10000 //延时 10秒
    }
});
  // 关闭连接
  await channel.close();
  await connection.close();
  process.exit(0);
})()