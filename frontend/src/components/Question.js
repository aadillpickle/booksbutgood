import React, { useRef, useState, useEffect } from "react";

function Question(props) {
	return (
		<div className="w-full py-6 bg-orange-200 rounded">
			<div className="p-3 text-sm mx-auto w-3/6 bg-white rounded shadow sansserif">
				<div className="font-bold">Who is Peter Thiel?</div>
				<div className="">A based investor</div>
			</div>
		</div>
	);
}

export default Question;
