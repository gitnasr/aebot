const express = require("express");
const { InfoFetcher, StartScrapper, SearchByOperationId } = require("../controller/arabseed");

// const { check_id, arabseed_validator } = require("../libs/middlewares/validators");
const router = express.Router();

router.route("/").post(InfoFetcher);
// router.route("/start").post(check_id, StartScrapper);
// router.route("/search").post(SearchByOperationId);

module.exports = router;
