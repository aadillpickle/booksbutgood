import React, { useRef, useState, useEffect } from "react";

function Question(props) {
	const [isRevealed, setIsRevealed] = useState(false);
	return (
		<div
			className={
				"w-full bg-orange-200 rounded" +
				(props.flashcard ? " p-2 rotate-2 my-5" : " py-6")
			}
		>
			<div
				className={
					"text-sm mx-auto bg-white rounded shadow sansserif" +
					(props.flashcard ? " p-3" : " w-4/6 py-6 px-3")
				}
			>
				<div className="flex flex-col leading-5 font-bold text-lg">
					{props.question || "Question?"}
					{!isRevealed && (
						<button
							onClick={() => {
								setIsRevealed(true);
							}}
							className="mt-4 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded cursor-pointer"
						>
							Click to reveal
						</button>
					)}
				</div>
				{isRevealed && (
					<div>
						<div className="mt-3">{props.answer || "Answer."}</div>
						<div className="flex gap-2">
							<div className="text-center mt-4 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded cursor-pointer w-3/6">
								I remembered
							</div>
							<div className="text-center mt-4 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-orange-500 hover:border-transparent rounded cursor-pointer w-3/6">
								I forgot
							</div>
						</div>
						<div className="flex items-center justify-between mt-6">
							{["Now", "1 week", "3 weeks", "3 months", "∞"].map(
								(time, i, times) => {
									return (
										<>
											<div
												key={i}
												className="flex flex-col items-center text-gray-500"
											>
												<div className="h-2 w-2 bg-orange-200 border-orange-500 border rounded-full"></div>
												<div
													className={
														"uppercase text-[10px] font-bold" +
														(time == "∞"
															? " text-[18px]"
															: "")
													}
												>
													{time}
												</div>
											</div>
											{i !== times.length - 1 && (
												<div className="text-gray-300">
													➔
												</div>
											)}
										</>
									);
								}
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Question;
