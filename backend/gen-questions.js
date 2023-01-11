const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const { getSummaryPrompt, getQandaGenPrompt, getSectionQuestionsPrompt } = require('./prompts.js')

let chapterId = 1;
const flashcardForSectionSummary = async (sectionSummary) => {
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: getSectionQuestionsPrompt + sectionSummary.trim() + "Question:",
		temperature: 0.8,
		max_tokens: 255,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		// stop: ["--"],
	});
	return response.data.choices[0].text;
}
const summarize = async (section) => {

	response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: getSummaryPrompt + "\n\nOriginal Section:" + section + "\n\nSummary:",
		temperature: 0.8,
		max_tokens: 462,
		top_p: 1,
		frequency_penalty: 0.02,
		presence_penalty: 0,
		stop: ["\\n"]
		});
		// console.log(response.data.choices[0].text.trim())
		return response.data.choices[0].text;
	};

	const genQuestionFromSummary = async (summary) => { //innacurately named - should be generated 3 flashcards for a summarized chapter
		response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: getQandaGenPrompt + summary + "\n\nFlashcards:",
			temperature: 0.85,
			max_tokens: 401,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			stop: ["--"] //for some reason this makes only 1 question get generated???
		});
		return response.data.choices[0].text
	}

async function main() {
	const chapter = await prisma.chapter.findUnique({
		where: {
			id: chapterId,
		},
		include: {
			sections: true,
		},
	});

	chapter.sections.forEach(async (sect, i) => {
		// if (i !== 0) return;
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `The following is a passage from Zero to One by Peter Thiel. The passage is between the two "===". Please generate a quiz question that would assess whether somebody read the full passage and comprehended it.

	DO NOT ask a question about a very specific part of the passage. Try to ask a question about the entire passage as a whole.
	DO NOT ask a question where the answer is a quote.
	DO NOT ask a question that references the passage, like "What does the passage say?" or "According to the passage..."
	DO ask a question that is a single sentence.
	DO ask a question where the answer is just a few words, or the name of a concept. The answer should not be a sentence or end with a period.

	Examples:
	Q: A single-qubit gate is represented as a 2 x 2 ____ matrix.
	A: unitary

	Q: What was the turning point of the Revolutionary War?
	A: The Battle of Saratoga

	===
	${sect.content}
	===
`,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		let completion = response.data.choices[0].text.trim().split("\n");
		let question = completion[0].replace("Q: ", "");
		let answer = completion[1].replace("A: ", "");
		console.log({ question, answer });

		await prisma.section.update({
			where: { id: sect.id },
			data: { question, answer },
		});
	});
}

// main();
module.exports.summarize = summarize;
module.exports.genQuestionFromSummary = genQuestionFromSummary;
module.exports.flashcardForSection = flashcardForSectionSummary;
