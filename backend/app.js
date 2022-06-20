const express = require("express");
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const requestIp = require('request-ip');
const useragent = require('express-useragent');
const httpStatus = require('http-status');

const config = require('./config/config');
const morgan = require('./config/morgan');

const Akoam = require("./routes/akoam")
const Arabseed = require("./routes/arabseed")
const Scrapy = require("./routes/scrapy")
const ApiError = require("./utils/ApiError");
const {errorConverter, errorHandler} = require("./utils/Errors");


const app = express();

app.use(requestIp.mw())
app.use(useragent.express());


// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(cors())

// 3) ROUTES
app.use("/akoam", Akoam);
app.use("/arabseed", Arabseed);
app.use("/", Scrapy);



app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
