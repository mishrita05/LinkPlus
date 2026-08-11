const express=require("express");
const router=express.Router();


const { getDashboardPage ,getMyUrlsPage,getCreateUrlPage ,getSignUpPage,getLogInPage} = require("../controllers/page");

const {
    restrictToLoggedinUserOnly
} = require("../middlewares/auth");

router.get(
    "/",
    restrictToLoggedinUserOnly,
    getDashboardPage
);

router.get(
    "/my-urls",
    restrictToLoggedinUserOnly,
    getMyUrlsPage
);

router.get(
    "/create",
    restrictToLoggedinUserOnly,
    getCreateUrlPage
);

router.get("/signup", getSignUpPage);

router.get("/login", getLogInPage);





module.exports=router;