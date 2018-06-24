const _ = require('lodash');
const express = require('express');
const app = require('express')();
const archiver = require('archiver');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config');
const { MainServerService } = require('./main.server.service');
const { gpioListener } = require('./gpio');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));

app.get('/download', function (req, res) {
  const archive = archiver('zip');
  res.attachment('jeu.zip');
  archive.pipe(res);
  const { creaRecords } = require('./admin');
  _.forEach(creaRecords, (value, key) => archive.append(value, { name: `${key}.wav` }));

  const { mainFlow } = require('./action.service');
  archive.append(Buffer.from(JSON.stringify(mainFlow), 'utf-8'), { name: 'actions.json' });
  archive.finalize();
});

app.get('/gpio/:channel/:state', function(req, res) {
  const pin = req.params.channel;
  const value = req.params.state;
  console.log('gpio', `${pin}_${value}`);
  const toEmit = `${pin}_${value}`;
  gpioListener.emit(toEmit);
  res.send('ok->'+toEmit);
})


http.listen(config.port, () => console.log(`app listening on port ${config.port}!`));
const mainServer = new MainServerService(config.mainServer);

module.exports = {
  app,
  http,
  io,
  mainServer
}
