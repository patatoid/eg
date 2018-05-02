const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config');
const { MainServerService } = require('./main.server.service');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));
http.listen(config.port, () => console.log(`app listening on port ${config.port}!`));
const mainServer = new MainServerService(config.mainServer);

module.exports = {
  app,
  http,
  io,
  mainServer
}
