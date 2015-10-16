var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/my_database_name';

var collection;

app.get('/', function(req, res){
  res.sendfile('views/index.html');
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      collection = db.collection('users');

      // collection.find({name: 'Guy'}).toArray(function(err, result){
      //   console.log(result);
      //   db.close();
    }
  })
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    if (msg === 'db'){
      collection.find({}).each(function(err, result){
        if (result) {
          io.emit('chat message', result.name);
        }
      })
    } else {
      io.emit('chat message', msg);  
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

