const express = require("express");
const ScrapyController = require("../controller/Scrapy")
const {OperationIdValidator} = require("../libs/validators/public");
const validate = require("../libs/validators");
const router = express.Router();


router.route("/search/:operation").get(validate(OperationIdValidator),ScrapyController.SearchByOperationId);
router.route("/cleanup").get(ScrapyController.CleanUp);

module.exports = router;