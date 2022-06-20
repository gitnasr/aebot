// const app = require("./app");
// const mongoose = require("mongoose");
// const { Server } = require("socket.io");
//
// const dotenv = require("dotenv");
// const Socket = require("./libs/Socket");
// dotenv.config({ path: "./.env" });
// const db = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
//
// mongoose.connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((res) => {
//     console.log("Database connection established");
//   })
//   .catch((err) => {
//     console.error("Database connection error: ", err);
//   });
//
// const port = process.env.PORT || 5000;
// const server = app.listen(port, () => {
//   console.log("App running on port " + port + "...");
// });
//
//
//
// const socket = new Server(server, { cors: { origin: "*" } });
//
//
// global.io = socket

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const Socket = require("./libs/Socket");
const { Server } = require("socket.io");
let server;
mongoose.connect(config.mongoose.url.replace("<PASSWORD>", config.mongoose.password), config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            logger.info("Restarting... ")
            server.restart()
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

// lobal.io = socket