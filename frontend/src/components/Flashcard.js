import React, { useState } from "react";

const Flashcard = (flashcardData) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [rememberClicked, setRememberClicked] = useState(false);
  const data = flashcardData.flashcardData
  const buttonClass = "bg-transparent hover:bg-slate-500 text-slate-700 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded"

  const resetStates = () => {
    setIsAnswerVisible(false)
    setRememberClicked(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        {/* ideally i wanna do this in tailwind but the tailwind styling isnt applyign to those 2eleemnts so i had to use in line style */}
        <p className='text-lg border-2 rounded border-slate-500 mb-4 p-2'>Card {data.cardId}/{data.totalCards}</p>
        <p style={{textAlign: "center"}}>{data.question}</p>
        <button onClick={()=>{setIsAnswerVisible(true)}} className={buttonClass}>Click to reveal answer</button>
        {isAnswerVisible && <>
          <p style={{textAlign: "center"}}>{data.answer}</p>
          <div className="flex flex-col justify-self-end mt-4">
            <p>Did you remember that?</p>
            <div className="flex flex-row items-center justify-center gap-2">
              <button onClick={()=>{setRememberClicked(true)}} className={buttonClass}>Yes</button>
              <button onClick={()=>{setRememberClicked(true)}} className={buttonClass}>No</button>
            </div>
          </div>
        </>
        }
      {rememberClicked && <button onClick={() => {
        resetStates();
        if (data.cardId + 1 > data.totalCards) {
          data.setIdFxn(1)
         } else {
          data.setIdFxn(data.cardId + 1)
          }
        }}className="border-2 rounded border-slate-500 p-2">Next Card</button>}

    </div>
  );
};

export default Flashcard;
