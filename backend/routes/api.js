const express = require("express");
const Akoam = require("../models/akoam");
const Arabseed = require("../models/arabseed");

const router = express.Router();


router.route("/search").post(async (req,res) => {
    const { id } = req.body
    const isArabseed = await Arabseed.findOne({operation:id}).select("-user")
    if (!isArabseed) {
        const isAkoam = await Akoam.findOne({operation:id}).select("-user")
        if (!isAkoam) return res.sendStatus(404)
        return res.json({result:isAkoam,service:"akoam"})
    }else{
        return res.json({result:isArabseed,service:"arabseed"})

    }
});


module.exports = router;
