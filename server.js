var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
var colors = ["FF0000", "00CCFF", "FFFFCC", "FF9900", "CC0099"]
var players = [];
var playersReady = 0;

function findPlayer(id){
  var foundPlayerIndex;
  players.forEach(function(player, index){
    console.log(player.id, id)
    if(player.id == id){
      foundPlayerIndex = index;  
    }
  })
  return foundPlayerIndex;
}

io.on('connection', function(socket){
  console.log('new connection');
  socket.emit('msg', 'connected to server')
  var socketID = socket.id;
  players.push({ id: socketID });
  console.log(socketID);
  socket.emit('newGame', 'getting name');

  socket.on('name', function(msg){
    console.log(players);
    console.log('New player name: ', msg);
    var playerIndex = findPlayer(socket.id)
    var player = players[playerIndex]
    if(playerIndex == 0){
      player.turn = true;
    } else {
      player.turn = false;
    }
    player.name = msg;
    player.num = playerIndex;
    player.color = colors[playerIndex];
    player.score = 0;
    player.numMeeples = 7;
    console.log(players);
    if(players.length == 2){
      io.sockets.emit('playersReady', players)
      players = [];
    }
  })

  
  socket.on('gameReady', function(){
    console.log("Game ready received");
    playersReady += 1;
    if(playersReady === 2){
      console.log('emitting game start call...')
      var tile = gameTiles.pop();
      io.sockets.emit('gameStart', {nextTileType: tile});
      playersReady = 0;
    }
  })

  socket.on('turnEnd', function(msg){
    console.log('End turn message from client: ', msg)
    var tileType = gameTiles.pop();
    msg.nextTileType = tileType;
    console.log('New tile: ',tileType)
    io.sockets.emit('newTurnCleanUp', msg);
    io.sockets.emit('newTurnTile', {nextTileType: tileType});
  })

  socket.on('brokenTile', function(msg){
    var tileType = swapTile(msg);
    socket.emit('replaceTile', {nextTileType: tileType});
  })
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

var gameTiles = 'AABBBBCDDDEEEEEFFGHHHIIJJJKKKLLLMMNNNOOPPPQRRRSSTUUUUUUUUVVVVVVVVVWWWWX'.split('');
gameTiles = randomizeGameTiles(gameTiles);

function randomizeGameTiles(gameTiles) {
  for (var i = gameTiles.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = gameTiles[i];
    gameTiles[i] = gameTiles[j];
    gameTiles[j] = temp;
  }
  return gameTiles;
}

function swapTile(type){
  console.log("Broken tile! Swapping tile");
  var tempArray = [];
  tempArray.push(type);
  gameTiles.forEach(function(currentTile){
    tempArray.push(currentTile);
  });
  gameTiles = tempArray;
  type = gameTiles.pop();
  return type;
//   game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
//   game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
//   tile = new Tile(game, this.screenWidth - 50, this.screenHeight - 50, type);
}
