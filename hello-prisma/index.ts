
import { PrismaClient } from './generated/prisma'
import express from 'express'
const prisma = new PrismaClient()

const app = express();
app.use(express.json());

//关联查找
app.get('/', async (req, res) => {
  const data = await prisma.users.findMany({
      include: {
          posts: true
      }
  })
  res.send(data)
})
//单个查找
app.get('/users/:id', async (req, res) => {
 const row =  await prisma.users.findMany({
      where: {
          id: Number(req.params.id)
      }
  })
  res.send(row)
})
//新增
app.post('/create', async (req, res) => {
  const { name, email } = req.body
  const data = await prisma.users.create({
      data: {
          name,
          email,
          posts: {
              create: {
                  title: '标题',
                  publish: true
              },
          }
      }
  })
  res.send(data)
})

//更新
app.post('/update', async (req, res) => {
  const { id, name, email } = req.body
  const data = await prisma.users.update({
      where: {
          id: Number(id)
      },
      data: {
          name,
          email
      }
  })
  res.send(data)
})

//删除
app.post('/delete', async (req, res) => {
  const { id } = req.body
  await prisma.post.deleteMany({
      where: {
          authorId: Number(id)
      }
  })
  const data = await prisma.users.delete({
      where: {
          id: Number(id),
      },
  })
  res.send(data)
})


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});