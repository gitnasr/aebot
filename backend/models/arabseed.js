var mongoose = require("mongoose");

var ArabseedSchema = new mongoose.Schema(
  {
    link: String,
    title: String,
    story: String,
    poster: String,
    episodes: Number,
    operation: String,
    result: Object,
    user: Object,
  },
  { timestamps: true }
);
var Arabseed = mongoose.model("Arabseed", ArabseedSchema);

module.exports = Arabseed;
