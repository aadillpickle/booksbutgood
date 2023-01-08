import "react-chat-elements/dist/main.css";
import { MessageList, Input, Button } from "react-chat-elements";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, redirect, Link } from "react-router-dom";
import Question from "../components/Question.js";

const searchInBook = async (indexedContent) => {
  //   const chapterIds = [1, 6, 5, 3, 7, 4, 10, 8, 2, 11, 12, 13, 14, 15, 9];
  const chapterIds = Array.from({length: 15}, (_, i) => i + 1)
  const options = { method: "GET" };
  const chapters = [];
  await Promise.all(
    chapterIds.map(async (id) => {
      const chapterContent = await fetch(
        process.env.REACT_APP_API_ROOT + "/md-chapter/" + id,
        options
      );
      const response = await chapterContent.json();
      const chapter = response.sections.map((section) => {
        var sectionContent = section.content.replace(/\n\n/g, '\n').replace(/\n/g, ' ');
        if (
          sectionContent.includes(indexedContent[0].substring(0, 20)) ||
          sectionContent.includes(indexedContent[1].substring(0, 20))
        ) {
          chapters.push({ id: id, title: response.title });
        }
      });
    })
  );
  return chapters;
};

const searchWithin = async (input) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{"question":"${input}"}`,
  };

  const result = await fetch(
    process.env.REACT_APP_API_ROOT + "/operand/search",
    options
  );
  const response = await result.json();
  return response;
};

function Chapter() {
  const { id } = useParams();
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const messageListReferance = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loadingChapter, setLoadingChapter] = useState(null);

  const routeChange = (pathToNavigate) => {
    redirect("/");
    redirect(pathToNavigate);
  };
  const handleClick = async (input) => {
    const response = await searchWithin(input);
    const chapters = await searchInBook(response[0]);
    let botText = "";
    if (response[1] !== "") {
      botText = (
        <p>
          {response[1]} You can read more in{" "}
          <button
            style={{ color: "blue" }}
            onClick={() => {
              setChapterId(chapters[0].id);
              routeChange(`chapter/${chapters[0].id}`);
            }}
          >
            Chapter {chapters[0].title}
          </button>
          or
          <button
            style={{ color: "blue" }}
            onClick={() => {
              setChapterId(chapters[1].id);
              routeChange(`chapter/${chapters[1].id}`);
            }}
          >
            Chapter {chapters[1].title}
          </button>
        </p>
      );
    } else {
      botText = (
        <p>
          You can read more in{" "}
          <button
            style={{ color: "blue" }}
            onClick={() => {
              setChapterId(chapters[0].id);
              routeChange(`chapter/${chapters[0].id}`);
            }}
          >
            Chapter {chapters[0].title}
          </button>{" "}
          or{" "}
          <button
            style={{ color: "blue" }}
            onClick={() => {
              setChapterId(chapters[1].id);
              routeChange(`chapter/${chapters[1].id}`);
            }}
          >
            Chapter {chapters[1].title}
          </button>
        </p>
      );
    }

    const userChatObj = {
      position: "right",
      type: "text",
      text: input,
      date: new Date(),
    };
    const botChatObj = {
      position: "left",
      type: "text",
      text: botText,
      date: new Date(),
    };
    setMessages([...messages, userChatObj, botChatObj]);
    inputRef.current.value = "";
  };

  const [bookId, setBookId] = useState(1);
  const [book, setBook] = useState(null);
  const [chapterId, setChapterId] = useState(id);
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    if (!bookId) return;
    fetch(process.env.REACT_APP_API_ROOT + "/book/" + bookId)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
        if (!chapterId) setChapterId(data.chapters[0].id);
      });
  }, [bookId]);

  useEffect(() => {
    if (!chapterId) return;
    setLoadingChapter(chapterId);
    fetch(process.env.REACT_APP_API_ROOT + "/chapter/" + chapterId)
      .then((response) => response.json())
      .then((data) => {
        setChapter(data);
        setLoadingChapter(null);
      });
  }, [chapterId]);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  async function search() {
    setSearchLoading(true);
    const chapterContent = await fetch(
      process.env.REACT_APP_API_ROOT +
        "/search?query=" +
        encodeURIComponent(searchQuery),
      { options: { method: "GET" } }
    );
    const response = await chapterContent.json();
    setSearchResults(response);

    setSearchLoading(false);
  }

  const [mouseOverTeaser, setMouseOverTeaser] = useState(false);
  const [mouseOverTOC, setMouseOverTOC] = useState(false);
  const displayingTOC = useRef(false);
  const toc = useRef(null);

  useEffect(() => {
    if ((mouseOverTOC || mouseOverTeaser) && !displayingTOC.current) {
      displayingTOC.current = true;
      toc.current.style.visibility = "";
      toc.current.style.opacity = "1";
      toc.current.style.transform = "translateX(0%)";
      setTimeout(() => {
        // for some bullshit reason this only works if i do it a few ms later
        searchRef.current.focus();
        const end = searchRef.current.value.length;
        searchRef.current.setSelectionRange(end, end);
        searchRef.current.focus();
      }, 100);
    } else if (!mouseOverTeaser && !mouseOverTOC && displayingTOC.current) {
      displayingTOC.current = false;
      toc.current.style.visibility = "hidden";
      toc.current.style.transform = "translateX(-10%)";
      toc.current.style.opacity = "0";
    }
  }, [mouseOverTOC, mouseOverTeaser]);

  return (
    <div id="app">
      <div
        id="toc"
        ref={toc}
        style={{
          visibility: "hidden",
          transform: "translateX(-100%)",
          opacity: 0,
        }}
        className="transition-all h-screen w-80 p-2 sansserif bg-stone-100/90 absolute z-10 overflow-scroll"
        onMouseEnter={() => setMouseOverTOC(true)}
        onMouseLeave={() => setMouseOverTOC(false)}
      >
        <div className="leading-4 text-sm p-4">
          <div className="font-semibold">{book?.title}</div>
          <div className="">{book?.author}</div>
          <form className="mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <svg
                  ariaHidden="true"
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                ref={searchRef}
                className="sans-serif block w-full p-2 pl-7 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-0"
                spellCheck="false"
                placeholder="Search for anything"
                required
                onKeyDown={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) setSearchResults(null);
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    search();
                  }
                }}
              />
            </div>
          </form>
        </div>

        {searchResults && searchResults.length && (
          <>
            <p
              className="text-sm ml-4 cursor-pointer"
              onClick={() => setSearchResults(null)}
            >
              Clear search
            </p>

            <div className="flex flex-col mt-2">
              {searchResults.map((result) => {
                return (
                  <div className="flex items-center text-sm rounded py-1 cursor-pointer px-3">
                    {result.content}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {!searchResults?.length && (
          <div className="flex flex-col mt-2">
            {book?.chapters ? (
              book.chapters.map((chapter) => {
                return (
                  <Link key={chapter.order} to={`/chapter/${chapter.id}`}>
                    <div
                      className={
                        "flex items-center text-sm rounded py-1 cursor-pointer px-3 transition-colors" +
                        (chapter.id == chapterId
                          ? " bg-stone-800 text-stone-200"
                          : " hover:bg-stone-200")
                      }
                      onClick={() => setChapterId(chapter.id)}
                    >
                      <div>
                        {chapter.title.includes(". ") ? (
                          <>
                            <span className="font-extrabold mr-2">
                              {chapter.title.split(". ")[0]}
                            </span>
                            <span>{chapter.title.split(". ")[1]}</span>
                          </>
                        ) : (
                          <>{chapter.title}</>
                        )}
                      </div>
                      {loadingChapter == chapter.id && (
                        <div id="loading-spinner" className="ml-auto">
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-stone-500"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="animate-pulse">
                <div className="hover:bg-stone-200 rounded py-2 px-3 transition-colors">
                  <div className="h-2 bg-stone-300  rounded col-span-2"></div>
                </div>
                <div className="hover:bg-stone-200 rounded py-2 px-3 transition-colors">
                  <div className="h-2 bg-stone-300  rounded w-4/6"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div id="columns" className="flex overflow-hidden h-screen">
        <div
          id="leftTease"
          className="w-30 h-full sansserif p-4 text-sm text-center flex flex-col opacity-50 hover:opacity-100 transition-opacity"
          onMouseEnter={() => setMouseOverTeaser(true)}
          onMouseLeave={() => setMouseOverTeaser(false)}
        >
          <div
            id="tease"
            className={
              "mt-auto text-gray-700 " + (!book ? "animate-pulse" : "")
            }
          >
            {book?.cover ? (
              <img alt="" className="h-24 mx-auto mb-4" src={book?.cover} />
            ) : (
              <div className="h-24 w-16 mx-auto mb-4 bg-gray-600" />
            )}

            <div id="title" className="font-semibold leading-4 text-gray-600">
              {book?.title || (
                <div className="h-2 bg-gray-600  rounded w-3/6" />
              )}
            </div>
            <div
              id="author"
              className="text-gray-500"
              style={{ fontSize: "0.75rem" }}
            >
              {book?.author}
            </div>
          </div>
        </div>
        <div id="contentContainer" className="flex-1 overflow-auto">
          <article
            id="content"
            className="px-12 py-16 max-w-2xl mx-auto prose prose lg:prose-xl"
          >
            {chapter?.sections?.map((sect) => (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sect.content,
                  }}
                />
                <Question question={sect.question} answer={sect.answer} />
              </>
            ))}
          </article>
        </div>
        <div
          id="right"
          className="flex flex-col w-96 ml-auto bg-blue-100 h-full"
        >
          {/* <div className="h-1/6" id="progress">
          quiz progress
          </div>
          <div className="h-2/6" id="question">
          quiz question
          </div> */}
          <div
            className="flex flex-row items-center justify-center h-3/6 m-4 font-sans bg-white rounded"
            id="coming-soon"
          >
            <p>Quizzes and flashcards coming soon</p>
          </div>
          <div className="flex flex-col h-3/6 justify-between" id="chat">
            <MessageList
              referance={messageListReferance}
              className="message-list font-sans overflow-y-scroll"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />

            <Input
              className="font-sans rounded mb-2"
              referance={inputRef}
              placeholder="Ask a question!"
              multiline={true}
              rightButtons={
                <Button
                  onClick={() => {
                    handleClick(inputRef.current.value);
                  }}
                  color="white"
                  backgroundColor="black"
                  text="Send"
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chapter;
