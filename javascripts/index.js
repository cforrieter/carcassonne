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
var url = 'mongodb://localhost:27017/carcassonne';

var backwards = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
function translations(side, position) {
  var translate = {
                    top: { x: position.x, y: position.y + 1},
                    right: { x: position.x + 1, y: position.y},
                    bottom: { x: position.x, y: position.y - 1 },
                    left: { x: position.x - 1, y: position.y }
                  };
  return translate[side];
};
var gameState;
var collection;

//app.get('/', function(req, res){
  // res.sendfile('views/index.html');
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      collection = db.collection('tiles');
      collection.find({}).toArray(function(err, items){
          gameState = items
          collection.findOne(function(err, item){
            var firstTile = item;
            console.log("Tile from DB:", firstTile);
            var terminusResults = checkForTerminus(firstTile, true);
            var terminus = terminusResults[0].position;
            var direction = terminusResults[1];
            console.log("terminus is:", terminus)
            switch(direction){
              case 'top':
                direction = "bottom";
                break;
              case 'bottom':
                break;
            }
            var road = completeRoad(terminus, direction, [], {});
            console.log("road", road);
          })
      });
    }
  })
//});


function checkForTerminus(placedTile, firstTile, direction) {
  console.log("check for terminus called");
  firstTile = firstTile || false;

  //TODO:: gameState.playedTiles
  if(!firstTile){
    //check for teminus -- end condition
    if(placedTile.center.condition == "terminus"){
      return [placedTile, direction];
    }
  }

  //check up for road
  return checkDirection('top');
  //check right for road
  return checkDirection('right');
  //check down for road
  return checkDirection('bottom');
  //check left for road
  return checkDirection('left');

  function checkDirection(side){
    if(placedTile[side].condition == "road" && direction != backwards[side]){
      // console.log("tile has a top road");
      direction = side;
      var newTile = gameState.filter(function(tile){
        return tile.position.x == placedTile.position.x && tile.position.y == (placedTile.position.y + 1);
      })[0];

      return checkForTerminus(newTile, false, direction);
    }
  }
}

function completeRoad(position, direction, currentPath, meeples){

  console.log('completedRoad called');
  console.log('position', position);
  var completedRoad;

  var placedTile = gameState.filter(function(tile){
    return tile.position.x == position.x && tile.position.y == position.y;
  })[0];

  if(!placedTile){
    console.log("exiting recursion");
    return null;
  }

  if(placedTile.center.condition == "terminus"){
    var terminus = true
    console.log("terminus is true")
    if(currentPath.length > 0){
      findMeeples(placedTile, backwards[direction], 'road');
      //TODO return meeples
      currentPath.push(placedTile);
      return [currentPath, meeples];
    }
  }

  completedRoad = (checkDirection('top') || checkDirection('right') || checkDirection('bottom') || checkDirection('left'));

  return completedRoad;

      function checkDirection(side) {
        if(placedTile[side].condition == "road" && direction != backwards[side] ){
          console.log(side + ' is a road')
          //remove meeple if present
          if(terminus){
            findMeeples(placedTile, backwards[direction], 'road');
          }else{
            findMeeples(placedTile, 'top', 'road');
            findMeeples(placedTile, 'right', 'road');
            findMeeples(placedTile, 'bottom', 'road');
            findMeeples(placedTile, 'left', 'road');
          }

            var newPosition = translations(side, position);

            currentPath.push(placedTile);
            return completeRoad(newPosition, side, currentPath, meeples);
          }
      }

      function findMeeples(tile, side, condition){
        if(tile[side].meeple && tile[side].condition == condition){
          meeples[tile[side].meeple] === undefined ? meeples[tile[side].meeple] = 1 : meeples[tile[side].meeple] += 1;
          tile[side].meeple = undefined;
        }
      }
}

function score(road){
  // var winner = Object.keys(meeples).reduce(function(maxValue, currentValue));
  //compare meeples for winner
  // addScore(road.length, winner);
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
