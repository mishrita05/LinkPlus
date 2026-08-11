const cron = require("node-cron");
const url = require("../models/url");


console.log("Cleaning expired links...");


cron.schedule("0 0 * * *", async () => {
    
    await url.deleteMany({
        expiresAt: {
            $ne: null,
            $lt: new Date(),
        },
    });
});

console.log("Expired URLs deleted.");
