import 'react-chat-elements/dist/main.css'
import { MessageBox, MessageList, Input, Button } from 'react-chat-elements'
import React, { useRef, useState } from 'react';

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
    setMessages([...messages, userChatObj])
    console.log(messages)
    inputRef.current.value = ''

  }

  return (
    <div id="app">
      <div id="columns" className="flex overflow-hidden h-screen">
        <div id="leftTease" className="w-30 h-full sansserif p-4 text-sm text-center flex flex-col opacity-50 hover:opacity-100 transition-opacity">
          <div id="tease" className="mt-auto text-gray-700">
            <img alt="" className="h-24 mx-auto mb-4" src="https://m.media-amazon.com/images/I/51ok0jWkjaL._AC_SY780_.jpg"/>
            <div id="title" className="font-semibold leading-4 text-gray-600">Hackers and Painters</div>
            <div id="author" className="text-gray-500" style={{fontSize: "0.75rem"}}>Paul Graham</div>
          </div>
        </div>
        <div id="contentContainer" className="flex-1 overflow-auto">
          <article id="content" className="px-2 py-16 max-w-2xl mx-auto prose prose lg:prose-xl">
            <h1>Book</h1>
          </article>
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
