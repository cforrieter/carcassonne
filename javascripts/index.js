/*
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
<script>
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
   socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
</script>
*/

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
    }
  })
});


function checkForTerminus(positionOfPlacedTile) {

  /*
    placedTile: {
    top: string
    right
    bottom
    left
    center
    position : {x: 1, y:2}
    meeple
  }
  */

  placedTile = gameState.playedTiles.filter(function(tile){
    return tile.position.x == positionOfPlacedTile.position.x && tile.position.y == positionOfPlacedTile.position.y;
  })[0];

  //check for teminus -- end condition
  if(placedTile.center == "terminus"){
    return positionOfPlacedTile;
  }

  //check up for road
  if(placedTile.top == "road"){
    var position = {
      x: positionOfPlacedTile.x,
      y: positionOfPlacedTile.y + 1,
    };
    return checkForTerminus(position);
  }

  //check right for road


  //check down for road


  //check left for road
}

function completeRoad(position, currentPath, meeples){


  placedTile = gameState.playedTiles.filter(function(tile){
    return tile.position.x == positionOfPlacedTile.position.x && tile.position.y == positionOfPlacedTile.position.y;
  })[0];

  if(placedTile.center == "terminus"){
    var terminus = true
    if(currentPath.length > 0){
      return [currentPath, meeples];
    }
  }


  if(placedTile.top.condition == "road"){
    //remove meeple if present
      if(terminus){
        if(placedTile.top.meeple){
          //remove meeple from top
          meeples[placedTile.top.meeple] === undefined ? meeples[placedTile.top.meeple] = 1 : meeples[placedTile.top.meeple] += 1;
          placedTile.top.meeple = undefined;
        }
      }else{
        if(placedTile.top.meeple){
          meeples[placedTile.top.meeple] === undefined ? meeples[placedTile.top.meeple] = 1 : meeples[placedTile.top.meeple] += 1;
          placedTile.top.meeple = undefined;
        }
        if(placedTile.left.meeple){
          meeples[placedTile.left.meeple] === undefined ? meeples[placedTile.left.meeple] = 1 : meeples[placedTile.left.meeple] += 1;
          placedTile.left.meeple = undefined;
        }
        if(placedTile.bottom.meeple){
          meeples[placedTile.bottom.meeple] === undefined ? meeples[placedTile.bottom.meeple] = 1 : meeples[placedTile.bottom.meeple] += 1;
          placedTile.bottom.meeple = undefined;
        }
        if(placedTile.right.meeple){
          meeples[placedTile.right.meeple] === undefined ? meeples[placedTile.right.meeple] = 1 : meeples[placedTile.right.meeple] += 1;
          placedTile.right.meeple = undefined;
        }
        if(placedTile.center.meeple){
          meeples[placedTile.center.meeple] === undefined ? meeples[placedTile.center.meeple] = 1 : meeples[placedTile.center.meeple] += 1;
          placedTile.center.meeple = undefined;
        }
      }

      var position = {
        x: positionOfPlacedTile.x,
        y: positionOfPlacedTile.y + 1,
      };

      currentPath << placedTile;
      return score(position, currentPath, meeples);
    }
}

function score(road){

  var winner = Object.keys(meeples).reduce(function(maxValue, currentValue));
  //compare meeples for winner
  addScore(road.length, winner);
}


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

  socket.on('placed tile', function(tile){
    addNewTileToGameState();
    var terminus = checkForTerminus(tile.position);
    var road = completeRoad(terminus.position, [], {});
    console.log(road);
    if(road){
      score(road);
    }

  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
