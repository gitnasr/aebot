const Scrapy = require("../models/scrapy");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const SearchByOperationId = catchAsync(async (req,res) => {
    const { operation } = req.params
    const data = await Scrapy.findOne({operation})
    if (!data) return res.sendStatus(httpStatus.OK)
    return res.json(data)

})
const CleanUp = catchAsync(async (req,res) => {
    await Scrapy.deleteMany({"user.ip":"::ffff:127.0.0.1"})
   return res.sendStatus(httpStatus.OK)
})

module.exports = {SearchByOperationId,CleanUp}