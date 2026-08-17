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

// Get favicon
    let faviconUrl =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="apple-touch-icon"]').attr("href") ||
        "";

    // Convert relative favicon URL into an absolute URL
    if (faviconUrl) {
        try {
            faviconUrl = new URL(faviconUrl, url).href;
        } catch (error) {
            faviconUrl = "";
        }
    }
    // Fallback if the website does not expose a favicon
    if (!faviconUrl) {
        try {
            const parsedUrl = new URL(url);

            faviconUrl =
                `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;

        } catch (error) {
            faviconUrl = "";
        }
    }
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
        faviconUrl,
    };
}

module.exports = {
    getWebpageContent,
};