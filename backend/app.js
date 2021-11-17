const express = require("express");
const app = express();
var cors = require('cors')

app.use(cors())

const Akoam = require("./routes/akoam")
const Arabseed = require("./routes/arabseed")
const Public = require("./routes/api")

// 1) MIDDLEWARE
app.use(function (req, res, next) {
  next();
});

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/akoam", Akoam);
app.use("/arabseed", Arabseed);
app.use("/", Public);



app.all("*", (req, res) => {
  res.sendStatus(404)
});

module.exports = app;
