const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://booksbutgood.up.railway.app"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/operand", (req, res) => {
  res.send("Hello Operand");
});

app.get("/book/:id", async (req, res) => {
  if (!req.params.id || !Number(req.params.id)){
    return res.status(400).send("invalid id");
  }

  const book = await prisma.book.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!book) return res.status(404).send("404 not found");

  book.chapters = await prisma.chapter.findMany({
    where: {
      bookId: book.id,
    },
    select: {
      id: true,
      title: true,
      order: true,
    },
  });

  book.chapters.sort(function (a, b) {
    return a.order - b.order;
  });

  return res.status(200).json(book);
});

app.get("/chapter/:id", async (req, res) => {
  if (!req.params.id || !Number(req.params.id)) {
    return res.status(400).send("invalid id");
  }
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (chapter) return res.status(200).json(chapter);
  else return res.status(404).send("404 not found");
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3001}`);
});
