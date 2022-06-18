const express = require("express");
const {
    InfoFetcher, StartScrapper, OldInfoFetcher, StartOldScrapper, SearchByOperationId,
} = require("../controller/akoam");
const validate = require("../libs/validators");
const AkoamValidators = require("../libs/validators/akoam");
const {InfoAndSourceRecorder} = require("../libs/middlewares/user.info");
const {FetcherIdValidator, OperationIdValidator} = require("../libs/validators/public");


const router = express.Router();
// TOKEN MIDDLEWARE for make sure that only from website and Rate Limiter
router.route("/").post(validate(AkoamValidators.ValidateNewAkoamLink), InfoAndSourceRecorder,InfoFetcher);
router.route("/start").post(validate(FetcherIdValidator), StartScrapper);


router.route("/old/").post(validate(AkoamValidators.ValidateOldAkoamLink), InfoAndSourceRecorder,OldInfoFetcher);
router.route("/old/start").post(validate(FetcherIdValidator), StartOldScrapper);

router.route("/search").post(validate(OperationIdValidator),SearchByOperationId);


module.exports = router;
