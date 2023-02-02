const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const util = require("util");
const { parse } = require("node-html-parser");
const removeMd = require("remove-markdown");
const {
  NodeHtmlMarkdown,
  NodeHtmlMarkdownOptions,
} = require("node-html-markdown");

const AWS = require("aws-sdk");
const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO00H3T2AD2MQLNJA4GF",
  secretAccessKey: "aKV1fAasAzaVjHhbGqZAA3gb6uyfPj5KReVVY3HWQKs",
});

const uniqid = require("uniqid");
let imagesDirectory = uniqid();

const EPub = require("epub2").EPub;
const initBook = () => {

  const epub = new EPub(
    // __dirname + "/zerotoone.epub",
    __dirname + "/sapiens.epub",
    `https://pass-the-baton.nyc3.cdn.digitaloceanspaces.com/booksbutgood/${imagesDirectory}/`
  );

  epub.on("end", async function () {
    // upload book cover image to DO
    let coverImage;
    if (epub.metadata?.cover) {
      let imageBuffer = await getImageAsync(epub, epub.metadata.cover);
      let coverMediaType = epub.manifest[epub.metadata.cover].mediaType;
      let coverKey = `booksbutgood/${imagesDirectory}/cover.${
        coverMediaType.split("/")[1]
      }`;
      await s3
        .putObject({
          Bucket: "pass-the-baton",
          Key: coverKey,
          Body: imageBuffer,
          ContentType: coverMediaType,
          ACL: "public-read",
        })
        .promise();
      coverImage =
        "https://pass-the-baton.nyc3.cdn.digitaloceanspaces.com/" + coverKey;
    }
    // create DB entry for book
      const book = await prisma.book.create({
        data: {
          title: epub.metadata.title,
          author: epub.metadata.creator,
          imagesDirectory,
          cover: coverImage,
        },
      });

    // upload images in book to DO
    Object.values(epub.manifest).forEach(async (file) => {
      if (file.mediaType.includes("image/")) {
        let imageBuffer = await getImageAsync(epub, file.id);
        await s3
          .putObject({
            Bucket: "pass-the-baton",
            Key: `booksbutgood/${book.imagesDirectory}/${file.href}`,
            Body: imageBuffer,
            ContentType: file.mediaType,
            ACL: "public-read",
          })
          .promise();
      }
    });

    // for each chapter, add an entry to DB
    Object.values(epub.toc).forEach(async (chapter) => {
      if (
        chapter.title == "Cover" ||
        chapter.title == "Title Page" ||
        chapter.title == "Contents" ||
        chapter.title == "Copyright" ||
        chapter.title.startsWith("Acknowledgments") ||
        chapter.title == "Index" ||
        chapter.title == "About the Authors" ||
        chapter.title == "Illustration Credits"
      )
        return;

      const dbChapter = await prisma.chapter.create({
        data: {
          title: chapter.title,
          order: chapter.order,
          book: {
            connect: { id: book.id },
          },
        },
      });

      let content = await getChapterAsync(epub, chapter.id);

      // run any reformatting on the html
      const root = parse(content);
      root.querySelector(".chapter_num1")?.remove();
      // remove zero to one duplicate images (maybe this has bad effects on other books, we'll see)
      root.querySelectorAll(".squeeze-epub")?.forEach((img) => {
        img.remove();
      });
      content = root.toString();

      // get indexes of all titles, to seperate that way we can generate quiz q's
      let h1 = [...content.matchAll(new RegExp("<h1", "gi"))].map((a) => a.index);
      let h2 = [...content.matchAll(new RegExp("<h2", "gi"))].map((a) => a.index);
      let h3 = [...content.matchAll(new RegExp("<h3", "gi"))].map((a) => a.index);
      let h4 = [...content.matchAll(new RegExp("<h4", "gi"))].map((a) => a.index);
      let allHeadings = [...h1, ...h2, ...h3, ...h4].sort(function (a, b) {
        return a - b;
      });

      let textCollection = [content.substr(0, allHeadings[0])];
      for (let i = 0; i < allHeadings.length - 1; i++) {
        textCollection.push(
          content.substr(allHeadings[i], allHeadings[i + 1] - allHeadings[i])
        );
      }
      textCollection.push(
        content.substr(allHeadings[allHeadings.length - 1], content.length)
      );

      let textQueue = [];

      textCollection.forEach(async (col, i) => {
        textQueue.push(col);
        if (removeMd(textQueue.join("")).length < 2500) return;

        let markdown = NodeHtmlMarkdown.translate(textQueue.join(""));
        textQueue = [];
        if (!markdown) return;
        const dbSection = await prisma.section.create({
          data: {
            order: i,
            content: markdown,
            chapter: {
              connect: { id: dbChapter.id },
            },
          },
        });
      });

      if (textQueue.length) {
        // maybe add this later?
      }
    });
    console.log("Added " + book.title);
  });

  epub.parse();

  function getImageAsync(epub, id) {
    return new Promise(function (resolve, reject) {
      epub.getImage(id, function (err, buffer) {
        resolve(buffer);
      });
    });
  }

  function getChapterAsync(epub, id) {
    return new Promise(function (resolve, reject) {
      epub.getChapter(id, function (err, chapter) {
        resolve(chapter);
      });
    });
  }
}

module.exports.initBook = initBook;
