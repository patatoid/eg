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

io.on('connection', function(socket) {
  socket.on('start-crea', () => CreaService.handleCrea(socket));
  socket.on('beginning', () => ActionService.beginning(socket));
  socket.on('start-admin', () => AdminService.startAdmin(socket));
  socket.on('crea-record', (record) => AdminService.saveCreaRecord(record));
});

http.listen(config.port, () => console.log(`app listening on port ${config.port}!`));

const process= url => ['open', ['-a', '/Applications/Chromium.app', `${url}`]];
const openURL = url => execa(...process(url));
