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
  theTime = theTime + .0009;
  setTimeout(theTimeChange, theTimeFraction);
};
theTimeChange();

function timeCheck() {
  io.emit('time check', theTime);
  setTimeout(timeCheck, 500);
};
timeCheck();

function theTimeSync() {
  io.emit('theTime', theTime);
  setTimeout(theTimeSync, 5000);
};
theTimeSync();

io.on('connection', function(socket) {

  io.emit('theTime', theTime);

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
  socket.on('time check', function(msg) {
    io.emit('time check', t);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
