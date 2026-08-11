const rateLimit = require("express-rate-limit");

const urlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many URL creation requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: "Too many URL suggestion requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    urlLimiter,
    aiLimiter
};