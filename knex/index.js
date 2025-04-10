import fs from 'node:fs'
import knex from "knex"
import mysql2 from "mysql2/promise"
import jsyaml from "js-yaml"
import express from "express"

// 加载yamll文件
const yaml = fs.readFileSync("./index.yaml", "utf8")
const config = jsyaml.load(yaml)
// 使用knex连接数据库
const db = knex({
  client: 'mysql2',
  connection:config.db
})

//创建表结构
// db.schema.createTableIfNotExists('user', table => {
//   table.increments('id') //id自增
//   table.integer('age') //age 整数
//   table.string('name') //name 字符串
//   table.string('hobby') //hobby 字符串
//   table.timestamps(true,true) //创建时间和更新时间
// }).then(() => {
//   console.log('创建成功')
// })
const app = express()
app.use(express.json())
//查
app.get('/', async (req, res) => {
  const row = await db('user').select().orderBy('id', 'desc')
  const count = await db('user').count()
  res.json({ code:200,row, count })
})
app.get('/user:id', async (req, res) => {
  const id = req.params.id
  const row = await db('user').select().where('id', id)
  res.send(row)
})
//增
app.post('/create', async (req, res) => {
  const { username, password, email } = req.body
  const data=db('user').insert({
    username,
    password,
    email
  })
  res.send({
    code:200,data
  })
})
// 删
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id 
  const data = await db('user').delete().where('id', id)
  res.send({
    code:200,data
  })
})
//改
app.put('/update/:id', async (req, res) => {
  const id = req.params.id
  const { username, password, email } = req.body
  const data = await db('user').update({
    username,
    password,
    email
  }).where('id', id)
  res.send({
    code:200,data
  })
})
app.listen(3000,() => {
  console.log('server is running')
  // 测试数据库连接
  db.raw('SELECT 1')
    .then(() => {
      console.log('数据库连接成功！')
    })
    .catch(err => {
      console.error('数据库连接失败:', err)
      process.exit(1) // 如果连接失败，终止应用
    })
})