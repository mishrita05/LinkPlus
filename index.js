const express=require("express");
const app=express();
const path=require("path");

require("dotenv").config();

const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute=require("./routes/user")

const cookieParser=require("cookie-parser");

const {restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth")

const {connectMongoDb} = require("./connection");
const url=require("./models/url");

require("./cron/healthCron");
require("./cron/expireCron");

const PORT=8001;

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));

app.use("/url",restrictToLoggedinUserOnly ,urlRoute);
app.use("/",checkAuth, staticRoute);
app.use("/user",userRoute);

app.get("/:shortid", async (req, res) => {

    const identifier = req.params.shortid;

    const entry = await url.findOne({
        $or: [
            { shortId: identifier },
            { customAlias: identifier },
        ],
    });

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    if (
        entry.expiresAt &&
        entry.expiresAt < new Date()
    ) {
        return res.render("expired");
    }

    entry.visitHistory.push({
        timestamp: Date.now(),
    });

    await entry.save();

    return res.redirect(entry.reDirectUrl);

});



connectMongoDb("mongodb://127.0.0.1:27017/short-url");

app.listen(PORT,()=>console.log(`Server started on Port ${PORT}`));
