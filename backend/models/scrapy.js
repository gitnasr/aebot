const mongoose = require("mongoose");

const ScrapySchema = new mongoose.Schema(
    {
        link: String,
        title: String,
        story: String,
        poster: String,
        episodes: Number,
        operation: String,
        result: Object,
        user: {type:Object, select:false
        },
        status:{
            default:"جاهز",
            type:String,
        },
        service:String,
        isError:{default:false,type:Boolean},
        isSuccess: {default:false,type:Boolean},
            info:Object,
            domain:String,
            quality:{type:Number,default:0},
        isProcessing:{default:false,type:Boolean},
        path:String,
        logo:String
    },
    { timestamps: true }
);
const Scapy = mongoose.model("Scrapy", ScrapySchema);

module.exports = Scapy;
