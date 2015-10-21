var screenWidth = 800;
var screenHeight = 600;

var players = {
  player1: {turn: false, num: 0, color: "FF0000", score: '000', numMeeples: 7},
  player2: {turn: false, num: 1, color: "00CCFF", score: '000', numMeeples: 3},
  player3: {turn: true, num: 2, color: "FFFFCC", score: '000', numMeeples: 4},
  player4: {turn: false, num: 3, color: "FF9900", score: '000', numMeeples: 2},
  player5: {turn: false, num: 4, color: "CC0099", score: '000', numMeeples: 1}
}

CarcassoneGame.mainGame = function(game) {
  // this.leftKey;
  // this.rightKey;
  // this.button;
  // this.camera;
  // this.spaceKey;
  this.screenWidth = 800;
  this.screenHeight = 600;


  //This may not be necessary, and can possibly be removed
  this.tilesGroup = new Phaser.Group(game);

  this.hudDisplay = new Phaser.Group(game)
  // this.gameTiles = 'AABBBBCDDDEEEEEFFGHHHIIJJJKKKLLLMMNNNOOPPPQRRRSSTUUUUUUUUVVVVVVVVVWWWWX'.split('');
};

CarcassoneGame.mainGame.prototype = {
  // var game = window.game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });



  // var attachedToPointer = false;
  preload: function() {

    game.load.image('background', './assets/background.png');
    game.load.spritesheet('tiles', 'assets/zelda-tilesprite.png', 88, 88, 24);
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')
    game.load.image('check', 'assets/check.png')
    game.load.image('tileBorder', 'assets/border.png')
    game.load.image('blueMeeple', 'assets/blueMeeple2.png')
    game.load.image('meepleFarmer', 'assets/meepleFarmer.png')
    game.load.image('meepleIcon', 'assets/meeple-flat.png')

  },

  create: function() {

    game.world.setBounds(0, 0, 13000, 13000);
    // game.add.tileSprite(0,0, 13000, 13000, 'background');

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
    checkFinishedRoads();
    addToCity(tile);
    // console.log(cities);
    checkFinishedCities();

    tile.inputEnabled = false;
    game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
    // console.log(game.world.centerX, game.world.centerY)
    createTile();

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(spaceKeyDown, this, 0, tile);

    var tileGroup = game.add.group();
    tileGroup.z = 1

    createHUD(this.hudDisplay)
    game.add.existing(this.hudDisplay)

    function createHUD(hudDisplay) {

      console.log('adding hud')
      hudDisplay.fixedToCamera = true;
      hudDisplay.render = true;
      hudDisplay.z = 100;

      for (player in players) {
        var player = players[player]
        player.meeples = game.add.group();
        hudDisplay.add(player.meeples)
        player.icon = game.add.graphics( 0, 0)
        hudDisplay.add(player.icon)
        player.icon.lineStyle(2, "0x" + player.color, 1);
        player.icon.beginFill("0x" + player.color, 0.9)
        player.icon.drawRect(10, 10 + player.num * 50, 40, 40);

        player.score = game.add.text(60, 7 + player.num * 50, "000", { font: "26px Lindsay", fill: "#" + player.color, align: "Left"});
        hudDisplay.add(player.score)

      };

      updateHUD()

      players.player1.numMeeples = 1
      // debugger
      updateHUD()
        // icon.fixedToCamera = true;
        // debugger;
        // game.context.fillStyle = player.color
        // game.context.fillRect(10, 10 + 60 * index, 50, 50)
        // icon.fixedToCamera = true;

        function updateHUD() {
          for (player in players) {
            var player = players[player];
            if (player.turn) {
              player.icon.alpha = 1;
              player.score.alpha = 1;
            } else {
              player.icon.alpha = 1;
              player.score.alpha = 1;
            }
            // player.score.text = "555"
            drawMeeples(60, 34 + player.num * 50,  player.numMeeples)
          // debugger;
        }

        function drawMeeples(x, y, quantity) {
          player.meeples.destroy();
          player.meeples = game.add.group();

          for (var i = 0; i < quantity; i++) {
            meep = game.add.sprite(x + 13 * i, y, 'meepleIcon', 0)
            meep.tint = "0x" + player.color
            meep.alpha = player.turn ? 1 : 1
            player.meeples.add(meep)
            // player.meep.z = 80
            // player.meeples.add(player.meep)
          }

          hudDisplay.add(player.meeples)

        }
      }
    }

    function spaceKeyDown() {
      this.game.camera.x = game.world.centerX;
      this.game.camera.y = game.world.centerY;
    }

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
    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      if(this.game.input.activePointer.position.x > this.screenWidth - 25) {
        this.game.camera.x += 8;
      }

      if(this.game.input.activePointer.position.x < 25) {
        this.game.camera.x -= 8;
      }

      if(this.game.input.activePointer.position.y < 25) {
        this.game.camera.y -= 8;
      }

      if(this.game.input.activePointer.position.y > this.screenHeight - 25) {
        this.game.camera.y += 8;
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
  console.log(type);


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
  console.log("swapping tile");
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
