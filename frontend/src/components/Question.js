import React, { useRef, useState, useEffect } from "react";

function Question(props) {
	return (
		<div className="w-full py-6 bg-orange-200 rounded">
			<div className="px-3 py-6 text-sm mx-auto w-3/6 bg-white rounded shadow sansserif">
				<div className="leading-5 font-bold text-lg">
					{props.question || "Question?"}
				</div>
				<div className="mt-3">{props.answer || "Answer."}</div>
			</div>
		</div>
	);
}

export default Question;
