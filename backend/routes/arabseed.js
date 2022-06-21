const express = require("express");
const { InfoFetcher, StartScrapper } = require("../controller/arabseed");
const ArabseedValidators = require("../libs/validators/arabseed");
const validate = require("../libs/validators");
const {InfoAndSourceRecorder} = require("../libs/middlewares/user.info");

const router = express.Router();

router.route("/").post(validate(ArabseedValidators.ArabseedLinkValidator),InfoAndSourceRecorder,InfoFetcher);
router.route("/start").post(validate(ArabseedValidators.ArabseedOperationValidator),StartScrapper);

module.exports = router;
