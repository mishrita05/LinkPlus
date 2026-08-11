const express=require("express");
const router=express.Router();
const{generateShortUrl,getAnalytics,suggestAliases,getEditPage,updateUrl,deleteUrl,getQRCode,checkAllUrlsHealth,genSummary,getDashboardStats,getUrlDetailsPage} =require("../controllers/url");
const { urlLimiter,aiLimiter } = require("../middlewares/rateLimiter");

router.post("/", urlLimiter, generateShortUrl);
router.get("/analytics/:shortId",getAnalytics);
router.post("/suggest",aiLimiter ,suggestAliases);
router.get("/edit/:id", getEditPage);
router.post("/edit/:id", updateUrl);
router.post("/delete/:id",deleteUrl);
router.get("/qr/:id", getQRCode);
router.get("/health-check", checkAllUrlsHealth);
router.get("/summary/:id", genSummary);
router.get("/stats", getDashboardStats);
router.get("/details/:id", getUrlDetailsPage);
module.exports=router;