const axios = require("axios");
const cheerio = require("cheerio");

async function getWebpageContent(url) {

    const response = await axios.get(url, {
        timeout: 10000,
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });

    const $ = cheerio.load(response.data);

    // Get title
    const title = $("title").text().trim();

    // Get meta description
    const description =
        $('meta[name="description"]').attr("content")?.trim() || "";

    // Remove unnecessary elements
    $(
        "script, style, nav, footer, header, aside, " +
        "form, iframe, noscript, svg, .advertisement, .ads"
    ).remove();

    // Extract visible text from the page
    const content = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

    return {
        title,
        description,
        content,
    };
}

module.exports = {
    getWebpageContent,
};