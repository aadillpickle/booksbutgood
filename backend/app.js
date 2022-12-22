const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const {
  operandClient,
  indexIDHeaderKey,
  ObjectService,
  Object,
} = require("@operandinc/sdk");


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

app.get('/operand', (req, res) => {
  res.send('Hello Operand')
  // (async () => {
  //   const operand = operandClient(
  //     ObjectService,
  //     "igblu081041y2h9lv6s8s3fa05yem41p2sko",
  //     process.env["OPERAND_API_KEY"],
  //     {
  //       [indexIDHeaderKey]: "e1v5mc48o0bi",
  //     }
  //   );
  //   const response = await operand.searchWithin({
  //     query: "why is peter thiel so rich",
  //   });
  //   res.send(response)
  //   // console.log(response);
  //   // console.log(response.matches.map((m) => `${m.content} (${m.score})`));
  // })();


})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3000}`)
})
