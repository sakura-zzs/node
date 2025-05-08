# 跨语言通信
import pika
# 创建连接
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
# 创建通道
channel = connection.channel()
# 声明队列
channel.queue_declare(queue='hello',durable=True)
message = 'I am Python'
# 发送消息
channel.basic_publish(exchange='',
                      routing_key='hello',
                      body=message)
connection.close()