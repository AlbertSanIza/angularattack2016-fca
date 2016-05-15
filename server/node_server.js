var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var integer = 0;
var time = 1/10*2;

function timezone()
{
   integer=integer+.0001;
   console.log(integer);
   setTimeout(timezone, time);
}

timezone();


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
