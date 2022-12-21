const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

// const user = await prisma.user.findUnique({
// 	where: {
// 		email: "riley@walzr.com"
// 	}
// })

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3000}`)
})