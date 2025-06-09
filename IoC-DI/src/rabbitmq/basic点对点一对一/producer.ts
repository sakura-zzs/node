import express from "express";
import amqplib from "amqplib";

(async() => {
  const app = express();

  // 连接mq
  const connection = await amqplib.connect("amqp://localhost");

  // 创建一个通道
  const channel = await connection.createChannel();

  // 声明一个消息
  const queue = "hello";

  app.get("/send", async (req, res) => {
    // 发送消息
    /**
     * 生产者把消息推入队列此时宕机了，重启之后消息丢失，为了解决这个问题我们需要实现持久化策略
     * 1. 队列持久化 消费者连接队列的时候开启 durable: true 即可实现队列持久化
     * 2. 消息持久化 发送方 在发送消息的时候 开启 persistent: true 即可持久化
     */
    await channel.sendToQueue(queue, Buffer.from("Hello World!"), {
      persistent: true, // 持久化消息
    });
    res.send("Message sent to the queue");
  });
  
  app.listen(3000, () => {
    console.log("producer listen 3000");
  });
})()