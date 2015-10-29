var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

// app.get('/', function(req, res){
//   res.sendfile('index.html');
//   // MongoClient.connect(url, function (err, db) {
//   //   if (err) {
//   //     console.log('Unable to connect to the mongoDB server. Error:', err);
//   //   } else {
//   //     console.log('Connection established to', url);
//   //   }
//   // })
// });
app.use('/javascripts', express.static('javascripts'));
app.use('/assets', express.static('assets'));
app.use(express.static('.'));

// var players = [
//   {turn: true, name: "Warren", num: 0, color: "FF0000", score: 0, numMeeples: 7},
//   {turn: false, name: "Jason", num: 1, color: "00CCFF", score: 0, numMeeples: 7},
//   {turn: false, name: "Corey", num: 2, color: "FFFFCC", score: 0, numMeeples: 7},
//   {turn: false, name: "Matt", num: 3, color: "FF9900", score: 0, numMeeples: 7},
//   {turn: false, name: "Link", num: 4, color: "CC0099", score: 0, numMeeples: 7}
// ];
var colors = ["FF0000", "00CCFF", "FFFFCC", "FF9900", "CC0099"];
var games = [];
var players = [];
var playersReady = 0;
var gameID;

function findPlayer(id, gameID){
  var foundPlayerIndex;

  players.forEach(function(player, index){
    console.log(player.id, id);
    if(player.id == id){
      foundPlayerIndex = index;
    }
  });
  return foundPlayerIndex;
}

io.on('connection', function(socket){
  console.log('new connection');
  socket.emit('msg', 'connected to server');
  console.log("Games", games);
  gameID = games.length;
  socket.join("game" + gameID);
  var socketID = socket.id;
  players.push({ id: socketID });
  // console.log(socketID);
  socket.emit('newGame', { gameID: gameID, playerIndex: players.length-1 });

  socket.on('name', function(msg){
    console.log("Msg:", msg);
    console.log("Players:", players);
    console.log('New player name: ', msg.name);
    var playerIndex = msg.playerIndex;
    console.log(playerIndex);
    var player = players[playerIndex];
    if(playerIndex == 0){
      player.turn = true;
    } else {
      player.turn = false;
    }
    player.name = msg.name;
    player.num = playerIndex;
    player.color = colors[playerIndex];
    player.score = 0;
    player.numMeeples = 7;
    console.log(players);
    console.log(players.length);
    if(players.length == 2){
      console.log("Players length = 2?  ", players.length);
      io.sockets.in('game' + msg.gameID).emit('playersReady', { players: players, gameID: msg.gameID })
      games.push( { players:players, deck: new GameTiles() });
      players = [];
    }
  })


  socket.on('gameReady', function(msg){
    console.log("Game ready received");
    playersReady += 1;
    if(playersReady === 2){
      console.log('emitting game start call...')
      var tile = games[msg.gameID].deck.tiles.pop();
      io.sockets.in('game' + msg.gameID).emit('gameStart', {nextTileType: tile});
      playersReady = 0;
    }
  })

  socket.on('turnEnd', function(msg){
    console.log('End turn message from client: ', msg)
    var tileType = games[msg.gameID].deck.tiles.pop();
    msg.nextTileType = tileType;
    console.log('New tile: ',tileType)
    io.sockets.in('game' + msg.gameID).emit('newTurnCleanUp', msg.message);
    io.sockets.in('game' + msg.gameID).emit('newTurnTile', {nextTileType: tileType});
  });

  socket.on('brokenTile', function(msg){
    var tileType = swapTile(msg.type, games[msg.gameID].deck.tiles);
    socket.in('game' + msg.gameID).emit('replaceTile', {nextTileType: tileType});
  });

  socket.on('gameOver', function(msg){
    // io.sockets.in('game' + msg.gameID).emit('gameOver');
    io.sockets.in('game' + msg.gameID).emit('newTurnCleanUp', msg.message);
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function GameTiles(){
  this.tiles = randomizeGameTiles('AABBBBCDDDEEEEEFFGHHHIIJJJKKKLLLMMNNNOOPPPQRRRSSTUUUUUUUUVVVVVVVVVWWWWX'.split(''));
}

function randomizeGameTiles(gameTiles) {
  for (var i = gameTiles.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = gameTiles[i];
    gameTiles[i] = gameTiles[j];
    gameTiles[j] = temp;
  }
  return gameTiles;
}

function swapTile(type, tiles){
  console.log("Broken tile! Swapping tile");
  var tempArray = [];
  tempArray.push(type);
  tiles.forEach(function(currentTile){
    tempArray.push(currentTile);
  });
  tiles = tempArray;
  type = tiles.pop();
  return type;
//   game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
//   game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
//   tile = new Tile(game, this.screenWidth - 50, this.screenHeight - 50, type);
}
