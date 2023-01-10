import React, { useRef, useState, useEffect } from "react";

function Question(props) {
	const [isRevealed, setIsRevealed] = useState(false);
	return (
		<div className="w-full py-6 bg-orange-200 rounded">
			<div className="px-3 py-6 text-sm mx-auto w-3/6 bg-white rounded shadow sansserif">
				<div className="flex flex-col leading-5 font-bold text-lg">
					{props.question || "Question?"}
					{!isRevealed && <button onClick={()=>{setIsRevealed(true)}} className= "mt-4 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded">Click to reveal</button>}
				</div>
				{isRevealed && <div className="mt-3">{props.answer || "Answer."}</div>}
			</div>
		</div>
	);
}

export default Question;
