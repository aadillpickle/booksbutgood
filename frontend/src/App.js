
function App() {
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
          In the science fiction books I read as a kid, reading had often been replaced by some more efficient way of acquiring knowledge. Mysterious "tapes" would load it into one's brain like a program being loaded into a computer.<br/><br/>

That sort of thing is unlikely to happen anytime soon. Not just because it would be hard to build a replacement for reading, but because even if one existed, it would be insufficient. Reading about x doesn't just teach you about x; it also teaches you how to write. <br/><br/>

Would that matter? If we replaced reading, would anyone need to be good at writing?<br/><br/>

The reason it would matter is that writing is not just a way to convey ideas, but also a way to have them.<br/><br/>

A good writer doesn't just think, and then write down what he thought, as a sort of transcript. A good writer will almost always discover new things in the process of writing. And there is, as far as I know, no substitute for this kind of discovery. Talking about your ideas with other people is a good way to develop them. But even after doing this, you'll find you still discover new things when you sit down to write. There is a kind of thinking that can only be done by writing.<br/><br/>

There are of course kinds of thinking that can be done without writing. If you don't need to go too deeply into a problem, you can solve it without writing. If you're thinking about how two pieces of machinery should fit together, writing about it probably won't help much. And when a problem can be described formally, you can sometimes solve it in your head. But if you need to solve a complicated, ill-defined problem, it will almost always help to write about it. Which in turn means that someone who's not good at writing will almost always be at a disadvantage in solving such problems.<br/><br/>

You can't think well without writing well, and you can't write well without reading well. And I mean that last "well" in both senses. You have to be good at reading, and read good things. <br/><br/>People who just want information may find other ways to get it. But people who want to have ideas can't afford to.

          </article>
        </div>
        <div id="right" className="flex flex-col w-96 ml-auto bg-blue-100 h-full">
          <div className="h-1/6" id="progress">
          quiz progress
          </div>
          <div className="h-2/6" id="question">
          quiz question
          </div>
          <div className="h-3/6" id="chat">
          ai chat
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
