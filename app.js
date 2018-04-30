const express = require('express');
const execa = require('execa');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
module.exports = { io }
const config = require('./config');
const CreaService = require("./crea");
const AdminService = require('./admin');
const { StateService, connections } = require('./state.service');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));

io.on('connection', function(socket) {
  socket.on('crea-connected', () => CreaService.handleCrea(socket));
  socket.on('start-crea', () => CreaService.startCrea(socket));
  socket.on('start-admin', () => AdminService.startAdmin(socket));
  socket.on('crea-record', (record) => AdminService.saveCreaRecord(record));
  setInterval(() => socket.emit('react', Math.random()), 1000);
  socket.on('identification', id => {
    connections.setState(id, true);
    socket.on('disconnect', () => connections.setState(id, false));
  })
});

http.listen(config.port, () => console.log(`app listening on port ${config.port}!`));

