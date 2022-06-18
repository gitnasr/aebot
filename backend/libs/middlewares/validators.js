const { isValidHttpUrl } = require("../helpers/is.url");

exports.new_akoam_link = async (req, res, next) => {
  // async middleware code here
  const { link } = req.body;

  if (
    !link ||
    !link.includes("akwam") ||
    link.includes("old") ||
    !link.includes("series") ||
    !isValidHttpUrl(link)
  )
    return res.json({ error: "link misinformed" });

  next();
};
exports.old_akoam_link = async (req, res, next) => {
  // async middleware code here
  const { link } = req.body;

  if (!link || !link.includes("old") || !isValidHttpUrl(link))
    return res.json({ error: "link misinformed" });

  next();
};

exports.arabseed_validator = async (req, res, next) => {
  // async middleware code here
  const { link } = req.body;

  if (!link || !link.includes("arabseed") || !isValidHttpUrl(link))
    return res.json({ error: "link misinformed" });

  next();
};

exports.check_id = async (req, res, next) => {
  const { id } = req.body;
  const ObjectId = require("mongoose");

  if (!id || !ObjectId.isValidObjectId(id))
    return res.json({ error: "Incorrect id provided" });

  next();
};
