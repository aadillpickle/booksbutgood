const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const { getSummaryPrompt, getQandaGenPrompt, getSectionQuestionsPrompt } = require('./prompts.js')

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


module.exports.summarize = summarize;
module.exports.genQuestionFromSummary = genQuestionFromSummary;
module.exports.flashcardForSection = flashcardForSectionSummary;
