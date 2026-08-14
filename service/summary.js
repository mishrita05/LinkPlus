const groq = require("./groq");
const { getWebpageContent } = require("./webpage");

async function generateSummary(url) {

    const {
        title,
        description,
        content,
    } = await getWebpageContent(url);

    // Limit content so extremely large webpages
    // don't consume unnecessary API tokens.
    const cleanContent = content.slice(0, 12000);

    const reply = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
            {
                role: "system",
                content: `
You are an expert webpage summarizer.

Your task is to create an accurate and useful summary of the webpage.

Rules:
- Write ONLY in English.
- Write 3 to 5 sentences.
- Clearly explain what the webpage is about.
- Explain the main purpose of the page.
- Include the most important topics or information.
- Use the webpage content as the primary source.
- Do not make up information.
- Do not make assumptions.
- Ignore navigation menus, advertisements, cookie notices,
  login prompts, footers, and other irrelevant website text.
- Do not simply repeat the title.
- Use simple, natural and professional English.
- Do not mention that you are an AI.
- Return ONLY the summary.
`
            },
            {
                role: "user",
                content: `
Webpage Title:
${title || "Not available"}

Webpage Description:
${description || "Not available"}

Main Webpage Content:
${cleanContent || "No webpage content available."}

Write a useful 3 to 5 sentence summary based on the webpage information above.
`
            }
        ]
    });

    return reply.choices[0].message.content.trim();
}

module.exports = {
    generateSummary,
};