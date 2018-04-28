const config = require('./config');
const CreaService = require("./crea");
const ActionService = require("./actions.service");
const AdminService = require('./admin');
const express = require('express');
const execa = require('execa');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));

io.on('connection', function(socket) {
  socket.on('crea-connected', () => CreaService.handleCrea(socket));
  socket.on('start-crea', () => CreaService.startCrea(socket));
  socket.on('begin', () => ActionService.begin(socket));
  socket.on('start-admin', () => AdminService.startAdmin(socket));
  socket.on('crea-record', (record) => AdminService.saveCreaRecord(record));
  setInterval(() => socket.emit('react', Math.random()), 1000);
});

http.listen(config.port, () => console.log(`app listening on port ${config.port}!`));
