// very cool and everything but sync sacrifices some stuff like performance so we are not using it
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var theTime = 0;
var theTimeFraction = 25;

function theTimeChange() {
  if(theTime >= 2147483600) {
    theTime = 0;
  }
  theTime = theTime + .0008;
  setTimeout(theTimeChange, theTimeFraction);
};
theTimeChange();

function theTimeSync() {
  io.emit('theTime', theTime);
  setTimeout(theTimeSync, 10000);
};
theTimeSync();


io.on('connection', function(socket) {

  io.emit('theTime', theTime);

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
