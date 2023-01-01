import 'react-chat-elements/dist/main.css'
import { MessageList, Input, Button } from 'react-chat-elements'
import React, { useRef, useState, useEffect } from 'react';
import Chapter from "./pages/Chapter.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const searchWithin = async (input) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: `{"question":"${input}"}`
  };

  const result = await fetch('http://localhost:3001/operand/search', options)
  const response = await result.json()
  return response;
}

const searchInBook = async (indexedContent) => {
  const chapterIds = [54, 55, 60, 61, 62, 63, 70, 65, 64, 66, 58, 67, 68, 71, 69, 57]
  const options = {method: 'GET'};
  const chapters = [];
  chapterIds.map(async (id) => {
    const chapterContent = await fetch('http://localhost:3001/chapter/' + id, options)
    const response = await chapterContent.json()
    const chapter = response.content
    if (chapter.includes(indexedContent[0].substring(0, 20)) || chapter.includes(indexedContent[1].substring(0, 20))) {
      chapters.push(id)
    }
  })
  return chapters;
}

function App() {
  const inputRef = useRef(null)
  const messageListReferance = useRef(null)
  const [messages, setMessages] = useState([])

  const [bookId, setBookId] = useState(9)
  const [book, setBook] = useState(null)
  const [chapterId, setChapterId] = useState(null)
  const [chapter, setChapter] = useState(null)

  const handleClick = async (input) => {
    const response = await searchWithin(input);
    const chapterNums = await searchInBook(response[0]);
    console.log(chapterNums.length)
    console.log(chapterNums)
    let botText = '';
    if (response[1] !== '') {
      botText = <p>{response[1]} You can read more in chapter <button onClick={setChapterId(chapterNums[0])}>{chapterNums[0]}</button></p>
    }
    else {
      botText = <p>You can read more in chapter <button onClick={setChapterId(chapterNums[0])}>{chapterNums[0]}</button></p>
    }
    console.log(botText)
    const userChatObj = {
      position: 'right',
      type: 'text',
      text: input,
      date: new Date(),
    }
    const botChatObj = {
      position: 'left',
      type: 'text',
      text: botText,
      date: new Date(),
    }
    console.log('wazup')
    setMessages([...messages, userChatObj, botChatObj])
    inputRef.current.value = ''
  }

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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Chapter/>} />
        <Route path="/chapter/:id" element={<Chapter/>} />
      </Routes>
    </Router>
  );
};

export default App;
