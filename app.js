const CreaServices = require("./crea");
const ActionServices = require("./actions.service");
const AdminServices = require('./admin');
const express = require('express');
const execa = require('execa');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

app.use(express.static(__dirname + '/views'));

io.on('connection', function(socket) {
  socket.on('start-crea', () => CreaServices.handleCrea(socket));
  socket.on('beginning', () => ActionServices.beginning(socket));
  socket.on('start-admin', () => AdminServices.startAdmin(socket));
  socket.on('crea-record', (record) => AdminServices.saveCreaRecord(record));
});

http.listen(port, () => console.log(`app listening on port ${port}!`));

const process= url => ['open', ['-a', '/Applications/Chromium.app', `${url}`]];
const openURL = url => execa(...process(url));
