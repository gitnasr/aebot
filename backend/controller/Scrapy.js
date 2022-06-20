const Scrapy = require("../models/scrapy");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const SearchByOperationId = catchAsync(async (req,res) => {
    const { operation } = req.params
    const data = await Scrapy.findOne({operation})

    if (!data) return res.sendStatus(httpStatus.NO_CONTENT)
    return res.json(data)

})

module.exports = {SearchByOperationId}