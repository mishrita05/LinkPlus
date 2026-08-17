const url = require("../models/url");
const dashboardService = require("../service/dashboard");



async function getDashboardPage(req, res) {
    const stats =
        await dashboardService.fetchDashboardStats(req.user._id);

    const dashboardStats = stats[0] || {
        totalUrls: 0,
        activeUrls: 0,
        expiredUrls: 0,
        healthyLinks: 0,
        brokenLinks: 0,
        totalClicks: 0,
    };

    const recenturls =
        await url.find({
            createdBy: req.user._id,
        })
        .sort({ createdAt: -1 })
        .limit(5);
    return res.render("dashboard",{
        stats:dashboardStats,
        recenturls,
        user: req.user,
    })
}

async function getMyUrlsPage(req, res) {
    const urls = await url.find({
        createdBy: req.user._id,
    });
    return res.render("myUrls", {
        urls,
        user: req.user,
        success: req.query.success || "",
    });
}

async function getCreateUrlPage(req, res) {

    return res.render("createUrl", {
        error: req.query.error || "",
        existingUrl: req.query.url || "",
        shortId: req.query.shortId || "",
        success: "",
    });

}

async function getSignUpPage(req, res) {

    return res.render("signup", {
        error: req.query.error || "",
    });

}

async function getLogInPage(req, res) {

    return res.render("login", {
        error: req.query.error || "",
    });

}

async function getShortcutsPage(req, res) {

    const urls = await url.find({
        createdBy: req.user._id,
    }).sort({
        createdAt: -1,
    });

    return res.render("shortcuts", {
        urls,
    });
}

module.exports = {
    getDashboardPage,
    getMyUrlsPage,
    getCreateUrlPage,
    getSignUpPage,
    getLogInPage,
    getCreateUrlPage,
    getShortcutsPage,
};