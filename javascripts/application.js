var screenWidth = 800;
var screenHeight = 600;


var globalPlayers = [
  {turn: true, name: "Warren", num: 0, color: "FF0000", score: 0, numMeeples: 7},
  {turn: false, name: "Jason", num: 1, color: "00CCFF", score: 0, numMeeples: 7},
  {turn: false, name: "Corey", num: 2, color: "FFFFCC", score: 0, numMeeples: 7},
  {turn: false, name: "Matt", num: 3, color: "FF9900", score: 0, numMeeples: 7},
  {turn: false, name: "Link", num: 4, color: "CC0099", score: 0, numMeeples: 7}
];


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
      if(globalPlayers[i+1]){
        globalPlayers[i+1].turn = true;
      }else{
        globalPlayers[0].turn = true;
      }
      break;
    }
  }
}


CarcassoneGame.mainGame = function(game) {
  this.tilesRemaining = 83;
  this.screenWidth = 800;
  this.screenHeight = 600;
  //This may not be necessary, and can possibly be removed
  // this.tilesGroup = new Phaser.Group(game);
  this.hudDisplay = new Phaser.Group(game)

};

CarcassoneGame.mainGame.prototype = {

  preload: function() {

    game.load.image('background', './assets/background.png');
    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')
    game.load.image('check', 'assets/check.png')
    game.load.image('tileBorder', 'assets/border.png')
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleFarmer', 'assets/meepleFarmer.png')
    game.load.image('meepleIcon', 'assets/meeple-flat.png')

  },

  create: function() {

    game.world.setBounds(0, 0, 13000, 13000);
    game.add.tileSprite(0,0, 13000, 13000, 'background');

    camera = new Phaser.Camera(game, 0 , 0, 0, this.screenWidth, this.screenHeight);
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;

    createTile('D');

    tile.fixedToCamera = false;

    //TODO, dry this out--code from tile.js dropping a tile
    tile.x = game.world.centerX + this.screenWidth/2;
    tile.y = game.world.centerY + this.screenHeight/2;
    tile.x = Math.floor((tile.x + 45) / 90) * 90;
    tile.y = Math.floor((tile.y + 45) / 90) * 90;
    tile.placeTile(tile, game.world.centerX, game.world.centerY);
    addToRoad(tile);
    addToCity(tile);
    // console.log(cities);

    tile.inputEnabled = false;
    game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
    // console.log(game.world.centerX, game.world.centerY)
    createTile();

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(spaceKeyDown, this, 0, tile);
    // spaceKey.onUp.add(spaceKeyUp, this, 0, tile);
    // var tileGroup = game.add.group();
    // tileGroup.z = 1

    createHUD(this);
    game.add.existing(this.hudDisplay);

    function createHUD(gameState) {

      gameState.hudDisplay.fixedToCamera = true;
      gameState.hudDisplay.render = true;
      gameState.hudDisplay.z = 100;

      var tilesLeftText = game.add.text(screenWidth - 100, 10, "Tiles: " + gameTiles.length, { font: "26px Lindsay", fill: "#FFFFCC", align: "right"});
      gameState.hudDisplay.add(tilesLeftText)

      
      //hud box draw
      var hudBox = game.add.graphics(0,0);
      hudBox.lineStyle(2, 0x505050, 0.2);
      hudBox.beginFill(0x505050, 0.8);
      hudBox.drawRect(5, 5, 190, 250);
      gameState.hudDisplay.add(hudBox);

      globalPlayers.forEach(function(player, index){
        player.meeples = game.add.group();
        gameState.hudDisplay.add(player.meeples);
        player.icon = game.add.graphics( 0, 0);
        gameState.hudDisplay.add(player.icon);
        player.icon.lineStyle(2, "0x" + player.color, 1);
        player.icon.beginFill("0x" + player.color, 0.9);
        player.icon.drawRect(10, 10 + index * 50, 40, 40)

        player.scoreObject = game.add.text(60, 7 + player.num * 50, player.name + '(0)', { font: "26px Lindsay", fill: "#" + player.color, align: "left"});
        gameState.hudDisplay.add(player.scoreObject);
      });

    }

    function spaceKeyDown() {
      this.game.camera.x = game.world.centerX;
      this.game.camera.y = game.world.centerY;
      
      // This stuff for zoom out
      // var lastTile = (playedTiles.length - 1) 
      // this.game.world.scale.setTo(0.4,0.4);
      // this.game.camera.x = playedTiles[lastTile].x / 2.5 - 400;
      // this.game.camera.y = playedTiles[lastTile].y / 2.5 - 300;
    }

    // function spaceKeyUp(){
    //   var lastTile = (playedTiles.length -1)
    //   this.game.world.scale.setTo(1,1);
    //   this.game.camera.x = playedTiles[lastTile].x - 400;
    //   this.game.camera.y = playedTiles[lastTile].y - 300;
    // }
  },

  randomizeGameTiles: function(gameTiles) {
    for (var i = gameTiles.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.gameTiles[i];
      this.gameTiles[i] = this.gameTiles[j];
      this.gameTiles[j] = temp;
    }
    return gameTiles;
  },

  update: function() {

    game.world.bringToTop(this.hudDisplay);
    game.state.states.mainGame.hudDisplay.children[0].text = "Tiles: " + gameTiles.length

    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      var scrollWidth = 50;
      var scrollSpeed = 20;

      if(this.game.input.activePointer.position.x > this.screenWidth - scrollWidth) {
        this.game.camera.x += Math.max(0, (this.game.input.activePointer.position.x - (this.screenWidth - scrollWidth))) / scrollWidth * scrollSpeed;
      }

      if(this.game.input.activePointer.position.x < scrollWidth) {
        this.game.camera.x -= Math.max(0, (scrollWidth - this.game.input.activePointer.position.x)) / scrollWidth * scrollSpeed;
      }

      if(this.game.input.activePointer.position.y < scrollWidth) {
        this.game.camera.y -= Math.max(0, (scrollWidth - this.game.input.activePointer.position.y)) / scrollWidth * scrollSpeed;
      }

      if(this.game.input.activePointer.position.y > this.screenHeight - scrollWidth) {
        this.game.camera.y += Math.max(0, (this.game.input.activePointer.position.y - (this.screenHeight - scrollWidth))) / scrollWidth * scrollSpeed;
      }
    }

    updateHUD()

    function updateHUD() {

      for (player in globalPlayers) {
        var player = globalPlayers[player];
        player.scoreObject.text = player.name + '(' + player.score + ')';
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

var gameTiles = 'AABBBBCDDDEEEEEFFGHHHIIJJJKKKLLLMMNNNOOPPPQRRRSSTUUUUUUUUVVVVVVVVVWWWWX'.split('');
gameTiles = randomizeGameTiles(gameTiles);

function createTile(type) {
    // var type = this.game.rnd.pick(('ABCDEFGHIJKLMNOPQRSTUVWX').split(''));
  type = type || gameTiles.pop();
  // console.log('Tile type: ',type);


  // debugger;
  // game.state.states.mainGame.tilesGroup.add(tile);

  tile = new Tile(game, this.screenWidth - 50, this.screenHeight - 50,  type);

  if ((tile.getValidMoves().length === 0 ) && (playedTiles.length > 0)){
    if (gameTiles.length === 0){
    //TODO -- handle this shit
    alert("Game over.");
    }
    swapTile(type);
  }

  this.game.add.existing(tile);
  // console.log('Possible moves: ',tile.getValidMoves());
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

// console.log(gameTiles);

function swapTile(type){
  console.log("Broken tile! Swapping tile");
  var tempArray = [];
  tempArray.push(type);
  gameTiles.forEach(function(currentTile){
    tempArray.push(currentTile);
  });
  gameTiles = tempArray;
  type = gameTiles.pop();
  game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
  game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
  tile = new Tile(game, this.screenWidth - 50, this.screenHeight - 50, type);
}

function endGame(){
  gameOver = true;
  endGameMonasteryCount();
  checkFinishedCities();
  checkFinishedRoads();
  console.log("GAME OVER, MAN. GAME OVER.")
}
