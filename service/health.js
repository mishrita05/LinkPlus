const axios = require("axios");

async function checkWebsiteHealth(url) {
    const start = Date.now();
    try {
        const response = await axios.get(url,{
            timeout:5000,
            maxRedirects:0,
        });
        const responseTime = Date.now() - start;
        return {
            healthStatus: "Healthy",
            statusCode: response.status,
            responseTime,
        };
    }
    catch(error) {
        const responseTime= Date.now()-start;
        if(error.response){
            const statusCode=error.response.status;
            if(statusCode >= 300 && statusCode < 400){
                return{
                    healthStatus:"Redirect",
                    statusCode,
                    responseTime
                }
            }
            return{
                healthStatus:"Broken",
                statusCode,
                responseTime
            }
            
        }
        return {
            healthStatus: "Unreachable",
            statusCode: null,
            responseTime: null,
        };
    }
}

module.exports = {
    checkWebsiteHealth,
};