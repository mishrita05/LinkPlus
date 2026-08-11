const groq = require("./groq");
const { getWebpageContent } = require("./webpage");

async function generateSummary(url) {

    const {
        title,
        description,
    } = await getWebpageContent(url);
    const reply = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
            {
                role: "system",
                content: `
    You are a webpage summarization assistant.

    Summarize web pages in 2-3 concise sentences.
    Always write the summary in clear, natural English.
    Never respond in Hindi or any other language.
    Return only the summary without headings or extra explanation.
    `
            },
            {
                role: "user",
                content: `
    Title:
    ${title}

    Description:
    ${description}

    Write a concise 2-3 sentence summary of this webpage in English.
    `
            }
        ]
    });

    return reply.choices[0].message.content;
}

module.exports = {
    generateSummary,
};