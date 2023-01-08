const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let showdown = require("showdown");
let markdownConverter = new showdown.Converter();
const { summarize, genQuestionFromSummary } = require("./gen-questions.js");
const fetch = require("node-fetch");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

const cors = require("cors");

// const { SearchWithinRequest, SearchWithinResponse, AnswerRequest, AnswerResponse } = require("@operandinc/sdk");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://booksbutgood.up.railway.app",
      "https://booksbutgood.com",
    ],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/search", async (req, res) => {
  // let match = await prisma.section.findMany({
  //     where: {
  //       content: {
  //         search: req.query.query,
  //       },
  //     },
  //   });

  // res.json(match)

  const options = {
    method: "POST",
    headers: {
      Authorization: process.env.OPERAND_API_KEY,
      "Operand-Index-ID": "2g2i2p14ddly",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: req.query.query,
      attemptAnswer: false,
      limit: 15,
    }),
  };

  const resp = await fetch(
    "https://api.operand.ai/operand.v1.OperandService/Search",
    options
  );
  const body = await resp.json();

  // body.results.forEach(async (result) => {
  //   let firstBit = result.content.substr(0, 100).split(" ");
  //   firstBit.pop();
  //   firstBit = firstBit.join(" ");
  //   console.log(firstBit);
  //   let match = await prisma.section.findFirst({
  //     where: {
  //       content: {
  //         search: firstBit,
  //       },
  //     },
  //   });
  //   console.log("match", match.id);
  // });
  res.json(body.results);
});

app.post("/operand/search", jsonParser, async (req, res) => {
  async function searchWithin(question) {
    const options = {
      method: "POST",
      headers: {
        Authorization: process.env.OPERAND_API_KEY,
        "Operand-Index-ID": "2g2i2p14ddly",
        "Content-Type": "application/json",
      },
      body: `{
        "query":"${question}",
        "attemptAnswer":true,
        "limit":2
      }`,
    };

    const resp = await fetch(
      "https://api.operand.ai/operand.v1.OperandService/Search",
      options
    );
    const body = await resp.json();

    try {
      return [body.results.map((m) => m.content), body.answer.answer];
    } catch (e) {
      return [body.results.map((m) => m.content), ""];
    }
  }
  const question = req.body.question;
  let result = await searchWithin(question);
  res.send(result);
});

app.get("/book/:id", async (req, res) => {
  if (!req.params.id || !Number(req.params.id)) {
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
    include: {
      sections: true,
    },
  });

  if (chapter) {
    chapter.sections.sort((a, b) => a.order - b.order);
    chapter.sections = chapter.sections.map((section) => {
      section.content = markdownConverter.makeHtml(section.content);
      return section;
    });
    return res.status(200).json(chapter);
  } else return res.status(404).send("404 not found");
});

app.post("/questions-for-chapter/:id", async (req, res) => {
  if (!req.params.id || !Number(req.params.id)) {
    return res.status(400).send("invalid id");
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      sections: true,
    },
  });

  if (chapter) {
    chapter.sections.sort((a, b) => a.order - b.order);
    let summarizedSections = await Promise.all (chapter.sections.map(async (section) => {
      return await summarize(section.content);
    }));
    console.log(summarizedSections)
    const flashcards = await genQuestionFromSummary(summarizedSections);
    console.log(flashcards)
    return res.status(200).send(flashcards);
  } else return res.status(404).send("404 not found");
});

app.get("/md-chapter/:id", async (req, res) => {
  if (!req.params.id || !Number(req.params.id)) {
    return res.status(400).send("invalid id");
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      sections: true,
    },
  });
  if (chapter) {
    return res.status(200).json(chapter);
  } else return res.status(404).send("404 not found");
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3001}`);
});
