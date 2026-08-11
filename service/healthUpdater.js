const url = require("../models/url");
const { checkWebsiteHealth } = require("./health");

async function updateAllWebsiteHealth() {

    const urls = await url.find({});

    for (const currentUrl of urls) {

        const health = await checkWebsiteHealth(
            currentUrl.reDirectUrl
        );

        currentUrl.healthStatus = health.healthStatus;
        currentUrl.statusCode = health.statusCode;
        currentUrl.responseTime = health.responseTime;
        currentUrl.lastChecked = new Date();

        await currentUrl.save();
    }

}

module.exports = {
    updateAllWebsiteHealth,
};