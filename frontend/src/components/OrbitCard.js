import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "./orbit.js"

const OrbitCard = (props) => {


  const question = props.question || "Question?";
  const answer = props.answer || "Answer.";
  return (
    <>
      <orbit-reviewarea color="blue">
        <orbit-prompt
          question={question}
          answer={answer}
        ></orbit-prompt>
      </orbit-reviewarea>
    </>
  )
}
export default OrbitCard;
