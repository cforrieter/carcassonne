var globalPlayers = [];
var gameID;
//
// var globalPlayers = [
//   {turn: true, name: "Warren", num: 0, color: "FF0000", score: 0, numMeeples: 7},
//   {turn: false, name: "Jason", num: 1, color: "00CCFF", score: 0, numMeeples: 7},
//   {turn: false, name: "Corey", num: 2, color: "FFFFCC", score: 0, numMeeples: 7},
//   {turn: false, name: "Matt", num: 3, color: "FF9900", score: 0, numMeeples: 7},
//   {turn: false, name: "Link", num: 4, color: "CC0099", score: 0, numMeeples: 7}
// ];

var gameOverText;

function getCurrentPlayer(){
  for(var player in globalPlayers){
    if(globalPlayers[player].turn){
      return globalPlayers[player];
    }
  }
}

function getPlayer(name){
  for(var player in globalPlayers){
    if(globalPlayers[player].name == name){
      return globalPlayers[player];
    }
  }
}

function nextTurn(){

  for(var i = 0; i < globalPlayers.length; i++){
    if(globalPlayers[i].turn){
      globalPlayers[i].turn = false;
      game.add.tween(globalPlayers[i].turnText).to( { alpha: 0 }, 100, "Linear", true);
      globalPlayers[i].tileBox.alpha = 0;
      if(globalPlayers[i+1]){
        globalPlayers[i+1].turn = true;
        // game.add.tween(globalPlayers[i + 1].tileBox).to( { alpha: 1 }, 600, "Linear", true);
        game.add.tween(globalPlayers[i + 1].turnText).to( { alpha: 1 }, 400, "Linear", true);
      }else{
        globalPlayers[0].turn = true;
        // game.add.tween(globalPlayers[0].tileBox).to( { alpha: 1 }, 600, "Linear", true);
        game.add.tween(globalPlayers[0].turnText).to( { alpha: 1 }, 400, "Linear", true);
      }
      break;
    }

  }
}

CarcassoneGame.mainGame = function(game) {
  this.hudDisplay = new Phaser.Group(game)
};

CarcassoneGame.mainGame.prototype = {

  preload: function() {

    if(gameMode == "zelda") {
      game.load.audio('game-music', 'assets/kakariko-theme.mp3');
    }
    else {
      game.load.audio('game-music', 'assets/game-music.mp3');
    }

    game.load.image('background', './assets/background.png');
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')
    game.load.image('check', 'assets/check.png')
    game.load.image('tileBorder', 'assets/border.png')
    game.load.image('meepleIcon', 'assets/meeple-flat.png')
    game.load.image('victory', 'assets/victory.png');
    game.load.image('defeat', 'assets/defeat.png');
  },

  create: function() {
    gameMusic = this.game.add.audio('game-music');
    gameMusic.loop = true;
    gameMusic.play();

    // Mute button
    muteButton = game.add.sprite(game.camera.width - 75, game.camera.height - 75, 'mute-button');
    muteButton.scale.set(0.25);
    muteButton.anchor.set(0.5);
    muteButton.tint = 0x2CA94F;
    muteButton.inputEnabled = true;
    muteButton.fixedToCamera = true;
    muteButton.events.onInputDown.add(this.muteMusic, this);


    game.world.setBounds(0, 0, 13000, 13000);
    game.add.tileSprite(0,0, 13000, 13000, 'background');

    camera = new Phaser.Camera(game, 0 , 0, 0, game.width, game.height);
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;

    // allMeeples = game.add.group();
    // game.add.existing(allMeeples);

    createTile('D');

    tile.fixedToCamera = false;

    //TODO, dry this out--code from tile.js dropping a tile
    tile.x = game.world.centerX + game.width/2;
    tile.y = game.world.centerY + game.height/2;
    tile.x = Math.floor((tile.x + 45) / 90) * 90;
    tile.y = Math.floor((tile.y + 45) / 90) * 90;
    tile.placeTile(tile, game.world.centerX, game.world.centerY);
    addToRoad(tile);
    addToCity(tile);
    addFarms(tile);
    // console.log(cities);

    var tileGroup = game.add.group();
    this.game.add.existing(tileGroup);

    tile.inputEnabled = false;
    game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
    // console.log(game.world.centerX, game.world.centerY)
    io.emit('gameReady', { gameID: gameID});

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(spaceKeyDown, this, 0, tile);
    // spaceKey.onUp.add(spaceKeyUp, this, 0, tile);
    // var tileGroup = game.add.group();
    // tileGroup.z = 1

    tabKey = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    tabKey.onDown.add(tabKeyDown, this, 0, tile);
    tabKey.onUp.add(tabKeyUp, this, 0, tile);

    createHUD(this);
    game.add.existing(this.hudDisplay);


    function createHUD(gameState) {
      function remainingTiles(){
        if(71 - playedTiles.length > 0){
          return (71 - playedTiles.length)
        } else {
          return 0;
        }
      }

      gameState.hudDisplay.fixedToCamera = true;
      gameState.hudDisplay.render = true;
      gameState.hudDisplay.z = 100;

      var tilesLeftText = game.add.text(game.width - 100, 10, "Tiles: " + (remainingTiles()), { font: "26px Lindsay", fill: "#FFFFCC", align: "right"});
      gameState.hudDisplay.add(tilesLeftText)

      //hud box draw
      var hudBox = game.add.graphics(0,0);
      hudBox.lineStyle(3, 0x000000, 1);
      hudBox.beginFill(0x000000, 0.4);
      hudBox.drawRoundedRect(5, 5, 190, 255, 5);
      gameState.hudDisplay.add(hudBox);

      gameOverText = game.add.text(game.width / 2, 35, 'GAME OVER!', { font: "42px Lindsay", fill: "#FFFFFF", align: "left"});
      gameOverText.anchor.setTo(0.5);
      gameOverText.alpha = 0;
      gameState.hudDisplay.add(gameOverText);

      globalPlayers.forEach(function(player, index){
        player.turnText = game.add.text(game.width / 2, 35, player.name + '\'s turn!', { font: "42px Lindsay", fill: "#" + player.color, align: "left"});
        player.turnText.anchor.setTo(0.5);
        player.turnText.alpha = player.turn ? 1 : 0;
        gameState.hudDisplay.add(player.turnText);

        player.tileBox = game.add.graphics(0, 0);
        gameState.hudDisplay.add(player.tileBox);
        player.tileBox.lineStyle(3, "0x" + player.color, 1);
        player.tileBox.drawRoundedRect(game.width / 2 - 45, 120 - 45, 88, 88, 5);
        player.tileBox.alpha = 0;

        player.meeples = game.add.group();
        gameState.hudDisplay.add(player.meeples);

        player.icon = game.add.graphics(0, 0);
        gameState.hudDisplay.add(player.icon);
        player.icon.lineStyle(2, "0x" + player.color, 1);
        player.icon.beginFill("0x" + player.color, 0.9);
        player.icon.drawRect(15, 15 + index * 50, 40, 40)

        player.scoreObject = game.add.text(60, 7 + player.num * 50, player.name + ' (0)', { font: "26px Lindsay", fill: "#" + player.color, align: "left"});
        gameState.hudDisplay.add(player.scoreObject);
      });

    }

   function spaceKeyDown() {
    if (!zoomedOut){
      var center = getBoardCenter();
      // this.game.camera.x = game.world.centerX;
      // this.game.camera.y = game.world.centerY;
      this.game.camera.x = center[0] - (game.width / 2);
      this.game.camera.y = center[1] - (game.height / 2);
    }
  }

    var savedX;
    var savedY;
    var zoomedOut = false;

    function tabKeyDown(){

      //ungrabbed new tile stays on screen, so make it invisible
      tile.visible = false;
      zoomedOut = true;

      savedX = this.game.camera.x;
      savedY = this.game.camera.y;

      var center = getBoardCenter();

      this.game.camera.x = (center[0] / 2.5) - (game.width / 2);
      this.game.camera.y = (center[1] / 2.5) - (game.height / 2);
      game.state.states.mainGame.hudDisplay.fixedToCamera = true;

      this.add.tween(this.game.world.scale).to({x: 0.4, y: 0.4}, 1, "Linear", true);

    }

    function tabKeyUp(){
      this.game.world.scale.setTo(1,1);
      this.game.camera.x = savedX;
      this.game.camera.y = savedY;

      tile.visible = true;
      zoomedOut = false;
    }
  

    io.on('gameStart', function(msg){
      console.log('recevied game start call:', msg);
      var currentPlayer = getCurrentPlayer();
      if(currentPlayer.id == io.io.engine.id){
        console.log("It's your turn! Creating tile!");
        createTile(msg.nextTileType);
        game.add.tween(currentPlayer.tileBox).to( { alpha: 1 }, 600, "Linear", true);
      }
    });

    io.on('newTurnCleanUp', function(msg){
      console.log("New Turn!");
      var currentPlayer = getCurrentPlayer();
      if(!(currentPlayer.id == io.io.engine.id)){
        console.log("Placing other player's tile")
        window.createTile(msg.tileType);
        var rotations = msg.rotations;
        if(rotations < 0){
          rotations += 4;
        }
        for(var x = 0; x < rotations; x++){
          tile.rotateRight();
        }
        tile.fixedToCamera = false;
        tile.x = msg.tileX;
        tile.y = msg.tileY;

        tile.placeTile(tile, msg.tileX, msg.tileY);

        var x = (playedTiles[playedTiles.length - 1].x) - (game.width / 2);
        var y = (playedTiles[playedTiles.length - 1].y) - (game.height / 2);
        game.add.tween(game.camera).to( { x, y }, 300 ).start();

        addToRoad(tile);
        addToCity(tile);
        addFarms(tile);
        if(msg.scoringObjectType == 'monastery'){
          var monastery = new Monastery();
          monastery.tile = tile;
          // monastery.meeples = getCurrentPlayer();
          monasteries.push(monastery);
        }
        tile.inputEnabled = false;
        game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
        game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);

        var scoringObject;

        if(msg.scoringObjectType == 'road'){
          scoringObject = findRoadById(msg.scoringObjectId);
        }
        if(msg.scoringObjectType == 'city'){
          scoringObject = findCityById(msg.scoringObjectId);
        }
        if(msg.scoringObjectType == 'monastery'){
          scoringObject = findMonasteryById(msg.scoringObjectId);
        }
        if(msg.scoringObjectType == 'farm'){
          scoringObject = findFarmById(msg.scoringObjectId);
        }

        console.log('Adding meeple');
        console.log("message: ", msg);
        var meepObject = {};
        meepObject.ghostCoords = msg.meepleCoords;
        meepObject.scoringObject = scoringObject;

        if(msg.scoringObjectType){
          if(msg.scoringObjectType == 'farm'){
            meepObject.farmer = true;
          }
          addMeeple(meepObject);
        }else{
          endTurn();
        }
      }
      //{lastMove, tile}
      //if(!mysocketid == currentPlayer socketid){
      //  rotate tile{
      //    if negative, add 4
      //  }
      //
      //  currentTile.placeTile(currentTile, msg.tileX, msg.tileY);
      //  center camera on tile
      //}
      //nextTurn()
      //
      //if(mysocketid == currentPlayer socketid){
      // draw tile
      //}
    })

    io.on('newTurnTile', function(msg){
      nextTurn();
      // console.log(game);
      var currentPlayer = getCurrentPlayer();
      if(currentPlayer.id == io.io.engine.id){
        console.log("It's your turn! Creating tile!")
        createTile(msg.nextTileType);
        game.add.tween(currentPlayer.tileBox).to( { alpha: 1 }, 600, "Linear", true);
      }
    })

    io.on('replaceTile', function(msg){
      createTile(msg.nextTileType);
    })

    io.on('gameOver', function(){
      endGame();
    })

  },

  muteMusic: function() {
    if (gameMusic.paused == false) {
      muteButton.tint = 0xED412C;
      gameMusic.pause();
    } else {
      muteButton.tint = 0x2CA94F;
      gameMusic.resume();
    }
  },

  update: function() {

    game.world.bringToTop(muteButton);

    if(gameOver == false) {
      game.world.bringToTop(this.hudDisplay);
    };
    game.state.states.mainGame.hudDisplay.children[0].text = "Tiles: " + (71 - playedTiles.length);

    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      var scrollWidth = 60;
      var scrollSpeed = 20;

      if(this.game.input.activePointer.position.x > game.width - scrollWidth) {
        this.game.camera.x += Math.max(0, (this.game.input.activePointer.position.x - (game.width - scrollWidth))) / scrollWidth * scrollSpeed;
      }

      if(this.game.input.activePointer.position.x < scrollWidth) {
        this.game.camera.x -= Math.max(0, (scrollWidth - this.game.input.activePointer.position.x)) / scrollWidth * scrollSpeed;
      }

      if(this.game.input.activePointer.position.y < scrollWidth) {
        this.game.camera.y -= Math.max(0, (scrollWidth - this.game.input.activePointer.position.y)) / scrollWidth * scrollSpeed;
      }

      if(this.game.input.activePointer.position.y > game.height - scrollWidth) {
        this.game.camera.y += Math.max(0, (this.game.input.activePointer.position.y - (game.height - scrollWidth))) / scrollWidth * scrollSpeed;
      }
    }

    updateHUD()

    function updateHUD() {

      for (player in globalPlayers) {
        var player = globalPlayers[player];
        if(tile.dragged) { player.tileBox.alpha = 0; }
        player.scoreObject.text = player.name + ' (' + player.score + ')';
        if (player.turn) {
          player.icon.alpha = 1;
          player.scoreObject.alpha = 1;
          player.meeples.alpha = 1;
        } else {
          player.icon.alpha = 0.05;
          // player.scoreObject.alpha = 0.3;
          // player.scoreObject.fill = "#FFFFFF";
        }
        drawMeeples(60, 38 + player.num * 50,  player.numMeeples)
      }

      function drawMeeples(x, y, quantity) {
        player.meeples.destroy();
        player.meeples = game.add.group();

        for (var i = 0; i < quantity; i++) {
          meep = game.add.sprite(x + 13 * i, y, 'meepleIcon', 0)
          meep.tint = "0x" + player.color
          // meep.alpha = player.turn ? 1 : 0.2
          meep.alpha = 1;
          player.meeples.add(meep)
        }

        game.state.states.mainGame.hudDisplay.add(player.meeples)

      }
    }

  },

  render: function() {

    // game.debug.cameraInfo(game.camera, 32, 32, 'rgb(150, 0, 0)');
    // game.debug.pointer(game.input.activePointer, 32, 32);
  },
};



function createTile(type) {
  tile = new Tile(game, game.width / 2, 120,  type);
  tile.alpha = 0;
  game.add.tween(tile).to( { alpha: 1 }, 600, "Linear", true);


  if ((tile.getValidMoves().length === 0 ) && (playedTiles.length > 0)){
    if (playedTiles.length === 0){
      //TODO -- handle this shit
      alert("Game over.");
    }else{
      io.emit('brokenTile', { type: type, gameID: gameID });
    }
  }else{
    this.game.add.existing(tile);
  }
}

// end of game displays function
function prepareEndGame() {
  sortFinalScores();
  displayFinalScores();
}

function sortFinalScores() {
  globalPlayers.sort(function(a, b){
    return b.score-a.score;
  });
}

function displayFinalScores() {
  if ((io.io.engine.id == globalPlayers[0].num) {
    var victoryImage = game.add.sprite(0,0,'victory');
    victoryImage.fixedToCamera = true;

    victoryImage.scale.set(game.camera.width/victoryImage.width, game.camera.height/victoryImage.height);
  } else {
    var defeatImage = game.add.sprite(0,0, 'defeat');
    defeatImage.scale.set(game.camera.width/defeatImage.width, game.camera.height/defeatImage.height);
    defeatImage.fixedToCamera = true;
  }
  var offset = 180;
  globalPlayers.forEach(function(player) {
    var style = { font: "20px Lindsay", fill: '#fdfe00', tabs: 123};
    text = game.add.text(140, 0 + offset, player.name + "\t" + player.score + "\n", style);
    text.fixedToCamera = true;
    offset += 45;
  });
}

// console.log(gameTiles);

function endGame(){

  gameOver = true;
  scoreFarms();
  endGameMonasteryCount();
  checkFinishedCities();
  checkFinishedRoads();
  // prepareEndGame();
  endGameScoringObjects = endGameMonasteries.concat(endGameCities).concat(endGameRoads).concat(endGameFarms);
  console.log("GAME OVER, MAN. GAME OVER.")

  for(var i = 0; i < globalPlayers.length; i++){
    game.add.tween(globalPlayers[i].turnText).to( { alpha: 0 }, 100, "Linear", true);
  }
  game.add.tween(gameOverText).to( { alpha: 1 }, 800, "Linear", true);
  setTimeout(function(){
    if(endGameScoringObjects.length > 0){
      endScoring();
    } else {
      endGameCleanupAndVictoryScreen();
    }
  }, 1250);
}

var endGameScoringObjects = [];
var scoringIndex = 0;

function endScoring(){
  center = getTileGroupCenter(endGameScoringObjects[scoringIndex][0].tiles);
  var cameraMove = this.game.add.tween(this.game.camera).to( {x: center[0], y: center[1] }, 500 ).start()
  cameraMove.onComplete.add(function(){
    scoreTilesAnimation(endGameScoringObjects[scoringIndex][0],endGameScoringObjects[scoringIndex][1],endGameScoringObjects[scoringIndex][2])
    setTimeout(function(){
      if(scoringIndex < endGameScoringObjects.length - 1){
        scoringIndex++;
        endScoring();
      } else {
        endGameCleanupAndVictoryScreen();

        farms.forEach(function(farm){
          scoreMeepAnimation(farm.meepleGroup, ['']);
        })

      }
    }, 1400);
  });
}

function endGameCleanupAndVictoryScreen(){
  console.log('clearing remaining farmers...')
  farms.forEach(function(farm){
    scoreMeepAnimation(farm.meepleGroup, ['']);
  })
  setTimeout(function(){
    console.log('calling prepareEndGame...')
    prepareEndGame();
  }, 1400);
}

function getBoardCenter(){
  var totalX = 0;
  var totalY = 0;
  var avgX;
  var avgY;
  playedTiles.forEach(function(tile){
    totalX += tile.x;
    totalY += tile.y;
  })
  avgX = totalX / playedTiles.length;
  avgY = totalY / playedTiles.length;

  return([avgX, avgY]);
}

function getTileGroupCenter(tiles){
  var totalX = 0;
  var totalY = 0;
  var avgX;
  var avgY;
  tiles.forEach(function(tile){
    totalX += tile.tile.x;
    totalY += tile.tile.y;
  })
  avgX = (totalX / tiles.length) - (game.width / 2);
  avgY = (totalY / tiles.length) - (game.height / 2);

  return([avgX, avgY]);
}

var scoringObjectType;

function endTurnServer(meepObject){
  var message = {tileType: tile.tileType, tileX: tile.x, tileY: tile.y, rotations: tile.numRotations};
  if(meepObject){
    scoringObjectType = getScoringObjectType(meepObject.scoringObject);
    message.meepleCoords = meepObject.ghostCoords;
    message.scoringObjectId = meepObject.scoringObject.id
    message.scoringObjectType = scoringObjectType
  }
  console.log('Sending to server...')
  //meeples need to be added to this object...
  // console.log('object in endTurnServer function: ', meepObject.scoringObject)
  io.emit('turnEnd', { message: message, gameID: gameID });
}

function getScoringObjectType(scoringObject){
  if (scoringObject instanceof City){
    return 'city';
  }
  if (scoringObject instanceof Road){
    return 'road';
  }
  if (scoringObject instanceof Monastery){
    return 'monastery';
  }

  return 'farm';

}
