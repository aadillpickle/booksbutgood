const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let showdown = require("showdown");
let markdownConverter = new showdown.Converter();
const { fuzzy, search, Searcher } = require("fast-fuzzy");
const removeMd = require("remove-markdown");

const { summarize, genQuestionFromSummary, flashcardForSection } = require("./gen-questions.js");

const fetch = require("node-fetch");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

// make searchable index
let fuzzyIndex;

makeFuzzyIndex();
async function makeFuzzyIndex() {
  let bookChapters = await prisma.chapter.findMany({
    where: {
      bookId: 1,
    },
    select: {
      id: true,
      title: true,
      order: true,
      sections: true,
    },
  });

  let sections = [];
  bookChapters.forEach((chapter) => {
    for (let i = 0; i < chapter.sections.length; i++) {
      chapter.sections[i].chapterName = chapter.title;
    }
    sections = [...sections, ...chapter.sections];
  });

  for (let i = 0; i < sections.length; i++) {
    sections[i].content = removeMd(sections[i].content).replace(
      /\r?\n|\r/g,
      " "
    );
  }

  fuzzyIndex = new Searcher(sections, {
    keySelector: (s) => s.content,
  });
}

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://booksbutgood.up.railway.app",
      "https://booksbutgood.com",
    ],
  })
);

app.get("/", async (req, res) => {
  res.send("OK then");
});

app.post("/search", jsonParser, async (req, res) => {
  if (!req.body.book) return res.status(404).json({ error: "no book" });
  if (!req.body.query) return res.json({ error: "no query" });

  // RILEY: this just works on zero to one for now, change it so it works for any book in db

  let fuzzyResults = fuzzyIndex.search(req.body.query, {
    returnMatchData: true,
  });

  for (let i = 0; i < fuzzyResults.length; i++) {
    let content = fuzzyResults[i].item.content;
    let index = fuzzyResults[i].match.index;
    let length = fuzzyResults[i].match.length;
    fuzzyResults[i].text =
      content.slice(0, index) +
      "<span class='highlight'>" +
      content.slice(index, index + length + 1) +
      "</span>" +
      content.slice(index + length + 1, content.length);
    fuzzyResults[i].text = fuzzyResults[i].text.substring(
      fuzzyResults[i].match.index - 60,
      fuzzyResults[i].match.index + fuzzyResults[i].match.length + 60
    );
    fuzzyResults[i].text =
      "<span class='dotdotdot'>" +
      "..." +
      "</span>" +
      fuzzyResults[i].text.trim() +
      "<span class='dotdotdot'>" +
      "..." +
      "</span>";
    fuzzyResults[i].sectionId = fuzzyResults[i].item.id;
    fuzzyResults[i].chapterId = fuzzyResults[i].item.chapterId;
    fuzzyResults[i].chapterName = fuzzyResults[i].item.chapterName;
    delete fuzzyResults[i].item;
    delete fuzzyResults[i].key;
    delete fuzzyResults[i].match;
    delete fuzzyResults[i].original;
    delete fuzzyResults[i].score;
  }

  res.json({
    query: req.body.query,
    fuzzyResults: fuzzyResults.slice(0, 50),
  });
});


app.post("/new/search", jsonParser, async (req, res) => {
  async function answer(question) {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: `{"userInput":"${question}"}`
    };

    const resp = await fetch('https://www.konjer.xyz/api/zero', options)
    const body = await resp.json();
    return body;
  }
    const question = req.body.question;
    let result = await answer(question);
    res.send(result);
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

app.get("/summary/:id", async (req, res) => {
  if (!req.params.id || !Number(req.params.id)) {
    return res.status(400).send("invalid id");
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
    if (chapter) {
      return res.status(200).json(chapter.summary);
    } else {
      return res.status(404).send("404 not found");
    }
});

app.post("/summarize-chapters", async (req, res) => {
  const chapterIds = [7,1,5,3,8,4,6,9,2,11,13,14,12,16, 10, 15]
  chapterIds.map(async (chapterId) => {

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      include: {
        sections: true,
      },
    });

    let summarizedSections = await Promise.all (chapter.sections.map(async (section) => {
      return await summarize(section.content);
    }));

    const chapterUpdate = await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        summary: summarizedSections,
      },
    });
    console.log(chapterUpdate)
  })
  return res.status(200);
});

app.post("/questions-for-all-sections", async (req, res) => {
  const sectionIds = Array.from({length: 55}, (_, i) => i + 1)

  for (let i = 0; i < sectionIds.length; i++) {
    const sectionId = sectionIds[i]
    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
      },
    });
    if(!section) continue;
    const summarizedSection = await summarize(section.content);
    const flashcard = await flashcardForSection(summarizedSection);
    const qanda = flashcard.split("Answer: ")
    // console.log(qanda)
    let sectionQuestion = qanda[0]
    //   if (qanda[0]) sectionQuestion = qanda[0].trim()
    let sectionAnswer = qanda[1]
    //   if(qanda[1]) sectionQuestion = .trim()
    // console.log(sectionQuestion, sectionAnswer)
    const sectionUpdate = await prisma.section.update({
      where: {
        id: sectionId,
      },
      data: {
        question: sectionQuestion,
        answer: sectionAnswer,
      },
    });
    console.log(sectionUpdate)
    console.log(i)
  }

  return res.status(200);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3001}`);
});
