const express = require("express");
const {
  InfoFetcher,
  StartScrapper,
  OldInfoFetcher,
  StartOldScrapper,
  SearchByOperationId,
} = require("../controller/akoam");
const {
  old_akoam_link,
  new_akoam_link,
  check_id,
} = require("../libs/middlewares/validators");
const router = express.Router();
// TOKEN MIDDLEWARE for make sure that only from website and Rate Limter
router.route("/").post(new_akoam_link, InfoFetcher);
router.route("/start").post(check_id, StartScrapper);


router.route("/old/").post(old_akoam_link, OldInfoFetcher);
router.route("/old/start").post(check_id, StartOldScrapper);

router.route("/search").post(SearchByOperationId);


module.exports = router;
