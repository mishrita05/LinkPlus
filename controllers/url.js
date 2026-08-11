const url=require("../models/url");
const { checkWebsiteHealth } = require("../service/health");
const groq = require("../service/groq");
const { nanoid} = require("nanoid");
const QRCode = require("qrcode");
const { generateSummary } = require("../service/summary");
const { getWebpageContent } = require("../service/webpage");
const { fetchDashboardStats } = require("../service/dashboard");
const mongoose = require("mongoose");



async function generateShortUrl(req,res){
    // const body=req.body;
    const {
        url: originalUrl,
        customAlias,
        expiry,
    } = req.body;
    if (!originalUrl) {
        return res.status(400).json({
            error: "URL is required"
        });
    }
    let expiresAt = null;
    if (expiry !== "never") {
        expiresAt = new Date();
        expiresAt.setDate(
            expiresAt.getDate() + Number(expiry)
        );
        console.log(expiresAt);
    }

    const existingUrl = await url.findOne({
        reDirectUrl: originalUrl,
        createdBy: req.user._id,
    });

    if (existingUrl) {

        return res.redirect(
            `/create?error=urlExists&url=${encodeURIComponent(originalUrl)}&shortId=${encodeURIComponent(
                existingUrl.customAlias || existingUrl.shortId
            )}`
        );

    }

    if (customAlias) {
        const existingAlias = await url.findOne({
            customAlias,
        });

        if (existingAlias) {
            return res.redirect(
                `/create?error=aliasExists&url=${encodeURIComponent(originalUrl)}`
            );
        }
    }

    const shortId=nanoid(8);
    await url.create({
        shortId: shortId,
        customAlias: customAlias || null,
        reDirectUrl: originalUrl,
        visitHistory:[],
        expiresAt,
        createdBy:req.user._id,
    });
    const urls = await url.find({
        createdBy: req.user._id,
    });
    // return res.render("createUrl",{
    //     id: customAlias || shortId,
    //     existingUrl: originalUrl,
    //     error: "",
    //     success: "urlCreated",
    // })
    return res.redirect("/my-urls?success=urlCreated");
    // return res.json({id: shortId})
}

async function getAnalytics(req,res){
    const shortId=req.params.shortId;
    const result = await url.findOne({
        shortId,
        createdBy: req.user._id,
    });
    return res.json({totalClicks: result.visitHistory.length, analytics:result.visitHistory});
}


async function suggestAliases(req, res) {
    const { url: originalUrl } = req.body;
    if(!originalUrl){
        return res.status(400).send("URL is required.");
    }
    const { title, description } =
    await getWebpageContent(originalUrl);
    try{
       const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
        You are an AI assistant that generates short, memorable, and meaningful URL aliases.

        Always:
        - Understand the webpage context before suggesting aliases.
        - Prefer descriptive and memorable keywords.
        - Return only a JSON array of strings.
        `
                },
                {
                    role: "user",
                    content: `
        Generate exactly 5 unique URL alias suggestions.

        Webpage Title:
        ${title}

        Webpage Description:
        ${description}

        Rules:
        - Generate exactly 5 aliases.
        - Base the aliases on the webpage title and description.
        - Use only lowercase letters, numbers, and hyphens.
        - No spaces.
        - Maximum length: 20 characters.
        - Make aliases descriptive, memorable, and easy to type.
        - Avoid generic words like "website", "page", "link", or "url".
        - Do not include explanations, numbering, markdown, or extra text.
        - Return ONLY a valid JSON array of strings.

        Example:
        ["legaltrack","legal-ai","fir-helper","ipc-guide","legal-assistant"]
        `
                }
            ]
        });
        const aliases = JSON.parse(response.choices[0].message.content);
        const existingAliases =  await url.find({customAlias: {$in: aliases,},});
        const usedAliases = existingAliases.map((alias) => alias.customAlias);
        const availableAliases = aliases.filter(
            (alias) => !usedAliases.includes(alias)
        );
        return res.json({
            aliases: availableAliases,
        });
    }
    catch(error){

        return res.status(500).json({
            error:"Unable to generate aliases"
        });

    }

}

async function getEditPage(req, res) {
    const id = req.params.id;
    const editUrl = await url.findOne({
        _id: id,
        createdBy: req.user._id,
    });
    return res.render("edit", {
        url: editUrl,
        error: req.query.error || "",
    });
}

async function updateUrl(req, res) {
    const { id } = req.params;
    const { url: originalUrl, customAlias ,expiry } = req.body;

    if (customAlias) {
        const existingAlias = await url.findOne({
            customAlias,
            _id: { $ne: id },
        });
        if (existingAlias) {
            return res.redirect(
                `/url/edit/${id}?error=aliasExists`
            );
        }
    }

    const existingUrl = await url.findOne({
        reDirectUrl: originalUrl,
        createdBy: req.user._id,
        _id: { $ne: id },
    });

    if (existingUrl) {
        return res.redirect(
            `/url/edit/${id}?error=urlExists`
        );
    }

    let expiresAt = null;

    if (expiry !== "never") {
        expiresAt = new Date();

        expiresAt.setDate(
            expiresAt.getDate() + Number(expiry)
        );
    }

    const updatedUrl = await url.findOneAndUpdate(
        {
            _id: id,
            createdBy: req.user._id,
        },
        {
            reDirectUrl: originalUrl,
            customAlias: customAlias || null,
            expiresAt,
        }
    );
    if (!updatedUrl) {
        return res.status(404).send("URL not found");
    }

    return res.redirect("/my-urls");
}

async function deleteUrl(req, res) {
    const { id } = req.params;

    const deletedUrl = await url.findOneAndDelete({
        _id: id,
        createdBy: req.user._id,
    });
    if (!deletedUrl) {
        return res.status(404).send("URL not found");
    }

    return res.redirect("/my-urls");
}

async function getQRCode(req, res) {

    const { id } = req.params;

    const urlData = await url.findOne({
        _id: id,
        createdBy: req.user._id,
    });

    if (!urlData) {
        return res.status(404).send("URL not found");
    }
    const {
        reDirectUrl: originalUrl,
        customAlias,
        shortId,
        visitHistory,
    } = urlData;
    const clicks = visitHistory.length;
    const shortLink =
        customAlias || shortId;

    const fullUrl = `http://localhost:8001/${shortLink}`;

    const qrImage = await QRCode.toDataURL(fullUrl);

    return res.render("qr", {
        qrImage,
        fullUrl,
        originalUrl,
        customAlias,
        clicks,
    });

}

const { updateAllWebsiteHealth } = require("../service/healthUpdater");

async function checkAllUrlsHealth(req, res) {

    try {

        await updateAllWebsiteHealth();

        return res.json({
            message: "Health check completed successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            error: "Unable to check website health.",
        });

    }

}

async function genSummary(req, res) {
    const id =req.params.id;
    const urlData = await url.findOne({
        _id: id,
        createdBy: req.user._id,
    });
    if (!urlData) {
        return res.status(404).send("URL not found");
    }
    const {reDirectUrl} =urlData;
    let summary = urlData.summary;
    if (!summary) {
        summary = await generateSummary(reDirectUrl);

        urlData.summary = summary;

        await urlData.save();
    }
    return res.render("summary", {
        summary,
        originalUrl: urlData.reDirectUrl,
        shortUrl: `http://localhost:8001/${urlData.customAlias || urlData.shortId}`,
    });
}

async function getDashboardStats(req, res) {

    const stats = await fetchDashboardStats(
        req.user._id
    );

    return res.json(stats);

}
async function getUrlDetailsPage(req, res) {

    const currentUrl = await url.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
    });

    if (!currentUrl) {
        return res.status(404).send("URL not found");
    }

    return res.render("urlDetails", {
        url: currentUrl,
        user: req.user,
    });
}

module.exports={
    generateShortUrl,
    getAnalytics,
    suggestAliases,
    getEditPage,
    updateUrl,
    deleteUrl,
    getQRCode,
    checkAllUrlsHealth,
    genSummary,
    getDashboardStats,
    getUrlDetailsPage,
}