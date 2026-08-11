const axios = require("axios");
const cheerio = require("cheerio");

async function getWebpageContent(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $("title").text().trim();
    const description = $('meta[name="description"]').attr("content");

    return {
        title,
        description,
    };
}

module.exports = {
    getWebpageContent,
};