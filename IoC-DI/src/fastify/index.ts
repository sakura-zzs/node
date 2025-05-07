import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
const app: FastifyInstance = Fastify({})
/**
 * schema 含请求和响应模式的对象。它们需要采用JSON 架构格式
 * body 验证post接口的参数
 * querystring 验证地址栏上面的参数也就是get
 * params 验证动态参数
 * response 过滤并生成响应的模式，设置模式可以使我们的吞吐量提高 10-20%
 */
const opts: RouteShorthandOptions = {
  schema: {
    body: {
        type: "object", //返回一个对象
        properties: { //返回的数属性描述
            name: { type: "string" }, //name是字符串类型
            version: { type: "string" } //version是字符串类型
        },
        required: ["name", "version"], //必填项
    },
    querystring: {
        type: "object",
        properties: {
            name: { type: "number" },
            version: { type: "number" }
        },
        required: ["name", "version"], //必填项
    },
    response: {
        200: {
            type: "object", //返回一个对象
            properties: { //返回的数属性描述
                data: {  //返回data
                    type: "array", //是个数组类型
                    items: { //子集
                        type: "object", //是个对象
                        properties: {  //子集的属性
                            name: { type: "string" },
                            version: { type: "string" }
                        }
                    }
                }
            }
        }
    }
}
}
app.post('/hello', opts, async (req, res) => {
  const { name, version } = req.body;
  //返回json  支持直接return
  return {
      name,
      version
  }
})
app.get('/', async (req, res) => {
  return {
      hello: 'world'
  }
})
app.route({
  method: "GET",
  url: "/list",
  schema: opts.schema,
  // 请求处理函数
  handler: (request, reply) => {
      request.query.name
      return {
          data: [{ name: "fastify", version: "4.27.0" }]
      }
  }
})
/**
 * 插件
 * 与 JavaScript 一样，一切都是对象，在 Fastify 中一切都是插件
 * Fastify 允许用户通过插件扩展其功能。插件可以是一组路由、服务器装饰器或其他任何东西。您需要使用一个或多个插件的 API 是register.
 * app就是fastify实例
 * options就是传递过来的传参数
 * done控制流程 跟express next一样
 */
app.register(function (fastify, opts, done) {
  app.decorate(opts.name, (a, b) => a + b);

    const res = app.add(1, 2)

    console.log(res)

    done()
}, {
  name: 'add',//传给插件的参数，插件中用opts接受
})
app.listen({port:3000}, () => {
  console.log('Server is running on port 3000')
})