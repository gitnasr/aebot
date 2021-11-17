const { Server } = require("socket.io");
const app = require('express')();
const server = require('http').createServer(app);


class Socket { 
 

  sendMessage(message, data) {
    try {
      global.io.emit(message, data);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Socket