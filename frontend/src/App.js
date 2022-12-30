import 'react-chat-elements/dist/main.css'
import { MessageBox, MessageList, Input, Button } from 'react-chat-elements'
import React, { useRef, useState, useEffect } from 'react';

const searchWithin = async (input) => {
  const options = {method: 'GET'};

  const result = await fetch('http://localhost:3001/operand', options)
  const response = await result.json()
  console.log(response)
  return response;
}

function App() {
  const inputRef = useRef(null)
  const messageListReferance = useRef(null)
  const [messages, setMessages] = useState([])

  const handleClick = (input) => {
    const userChatObj = {
      position: 'right',
      type: 'text',
      text: input,
      date: new Date(),
    }
    const botChatObj = {
      position: 'left',
      type: 'text',
      text: searchWithin(input),
      date: new Date(),
    }
    console.log('wazup')
    setMessages([...messages, userChatObj, botChatObj])
    inputRef.current.value = ''
  }

  const [bookId, setBookId] = useState(9)
  const [book, setBook] = useState(null)
  const [chapterId, setChapterId] = useState(null)
  const [chapter, setChapter] = useState(null)

  useEffect(()=>{
    if (!bookId) return
    fetch(process.env.REACT_APP_API_ROOT + '/book/' + bookId)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
        if (!chapterId) setChapterId(data.chapters[0].id)

      })
  }, [bookId])

  useEffect(()=>{
    if (!chapterId) return
    fetch(process.env.REACT_APP_API_ROOT + '/chapter/' + chapterId)
      .then((response) => response.json())
      .then((data) => setChapter(data));
  }, [chapterId])


  const [mouseOverTeaser, setMouseOverTeaser] = useState(false);
  const [mouseOverTOC, setMouseOverTOC] = useState(false);
  const displayingTOC = useRef(false);
  const toc = useRef(null);


  useEffect(()=>{
    if ((mouseOverTOC || mouseOverTeaser) && !displayingTOC.current){
      displayingTOC.current = true
      toc.current.style.visibility = ""
      toc.current.style.opacity = "1"
      toc.current.style.transform = "translateX(0%)"
    } else if (!mouseOverTeaser && !mouseOverTOC && displayingTOC.current){
      displayingTOC.current = false
      toc.current.style.visibility = "hidden"
      toc.current.style.transform = "translateX(-10%)"
      toc.current.style.opacity = "0"
    }
  }, [mouseOverTOC, mouseOverTeaser])


  return (
    <div id="app">
      <div id="toc" ref={toc} style={{visibility: "hidden", transform: "translateX(-100%)", opacity: 0}} className="transition-all h-screen w-80 p-2 sansserif bg-stone-100/90 absolute z-10 overflow-scroll"
      onMouseEnter={() => setMouseOverTOC(true)}
        onMouseLeave={() => setMouseOverTOC(false)}>
        <div className="leading-4 text-sm p-4">
        <div className="font-semibold">{book?.title}</div>
        <div className="">{book?.author}</div>
        </div>

        <div className="flex flex-col mt-5">
          {book?.chapters ? book.chapters.map((chapter)=>{
            return <div key={chapter.order} className="hover:bg-stone-200 text-sm rounded py-1 cursor-pointer px-3 transition-colors" onClick={()=>setChapterId(chapter.id)}>{chapter.title}</div>
          }) : <div className="animate-pulse">
            <div className="hover:bg-stone-200 rounded py-2 px-3 transition-colors">
              <div className="h-2 bg-stone-300  rounded col-span-2"></div>
            </div>
            <div className="hover:bg-stone-200 rounded py-2 px-3 transition-colors">
              <div className="h-2 bg-stone-300  rounded w-4/6"></div>
            </div>
          </div>}

        </div>
      </div>
      <div id="columns" className="flex overflow-hidden h-screen">
        <div id="leftTease" className="w-30 h-full sansserif p-4 text-sm text-center flex flex-col opacity-50 hover:opacity-100 transition-opacity" onMouseEnter={() => setMouseOverTeaser(true)}
        onMouseLeave={() => setMouseOverTeaser(false)}>
          <div id="tease" className={"mt-auto text-gray-700 " + (!book ? "animate-pulse" : "")}>
            {book?.cover ? <img alt="" className="h-24 mx-auto mb-4" src={book?.cover}/> : <div className="h-24 w-16 mx-auto mb-4 bg-gray-600"/>}

            <div id="title" className="font-semibold leading-4 text-gray-600">{book?.title || <div className="h-2 bg-gray-600  rounded w-3/6"/>}</div>
            <div id="author" className="text-gray-500" style={{fontSize: "0.75rem"}}>{book?.author}</div>
          </div>
        </div>
        <div id="contentContainer" className="flex-1 overflow-auto">
          <article id="content" dangerouslySetInnerHTML={{ __html: chapter?.content }} className="px-12 py-16 max-w-2xl mx-auto prose prose lg:prose-xl"/>
        </div>
        <div id="right" className="flex flex-col w-96 ml-auto bg-blue-100 h-full">
          <div className="h-1/6" id="progress">
          quiz progress
          </div>
          <div className="h-2/6" id="question">
          quiz question
          </div>
          <div className="flex flex-col h-3/6 justify-between" id="chat">
          <MessageList
            referance={messageListReferance}
            className='message-list font-sans overflow-y-scroll'
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={messages} />

            <Input
              className= 'font-sans rounded mb-2'
              referance={inputRef}
              placeholder='Ask a question!'
              multiline={true}
              rightButtons={<Button onClick={() => {handleClick(inputRef.current.value);}} color='white' backgroundColor='black' text='Send' />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
