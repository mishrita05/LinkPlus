const mongoose=require("mongoose");

const urlschema= new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true,
    },
    customAlias: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
    },
    reDirectUrl:{
        type:String,
        required:true,
    },
    faviconUrl: {
        type: String,
        default: "",
    },
    visitHistory:[{ timestamp:{type:Number}}],
    healthStatus: {
        type: String,
        enum: ["Unknown", "Healthy", "Redirect", "Broken", "Unreachable"],
        default: "Unknown",
    },
    

    statusCode: {
        type: Number,
        default: null,
    },

    lastChecked: {
        type: Date,
        default: null,
    },

    responseTime: {
        type: Number,
        default: null,
    },
    summary: {
        type: String,
        default: "",
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }
},{timestamps:true});

const url=mongoose.model("url",urlschema);

module.exports=url;