const express = require("express");
const Scrapy = require("../models/scrapy");

const router = express.Router();


router.route("/search").post(async (req,res) => {
    const { id } = req.body
    const data = await Scrapy.findOne({operation:id}).select("-user")
    return res.json(data)

});


module.exports = router;
