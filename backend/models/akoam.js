const mongoose = require("mongoose");

const AkoamSchema = new mongoose.Schema(
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
const Akoam = mongoose.model("Akoam", AkoamSchema);

module.exports = Akoam;
