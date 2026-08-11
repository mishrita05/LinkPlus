const cron = require("node-cron");
const { updateAllWebsiteHealth } = require("../service/healthUpdater");

cron.schedule("* * * * *", async () => {

    console.log("Running website health check...");

    try {

        await updateAllWebsiteHealth();

        console.log("Website health updated successfully.");

    } catch (error) {

        console.error(error);

    }

});