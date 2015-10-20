// var rotate = require('./rotate');
CarcassoneGame.mainGame = function(game) {
  this.leftKey;
  this.rightKey;
  this.button;
  this.camera;
  this.spaceKey;
  this.gameTiles = 'AABBBBCDDDEEEEEFFGHHHIIJJJKKKLLLMMNNNOOPPPQRRRSSTUUUUUUUUVVVVVVVVVWWWWX'.split('');
  this.screenWidth = 800;
  this.screenHeight = 600;
};

CarcassoneGame.mainGame.prototype = {
  // var game = window.game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });


  // var attachedToPointer = false;
  preload: function() {

    game.load.image('background', './assets/background.png');
    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')
    game.load.image('check', 'assets/check.png')
    game.load.image('tileBorder', 'assets/border.png')
    game.load.image('blueMeeple', 'assets/blueMeeple2.png')
    game.load.image('meepleFarmer', 'assets/meepleFarmer.png')

  },

  // var spaceKey;

  create: function() {

    game.world.setBounds(0, 0, 13000, 13000);
    game.add.tileSprite(0,0, 13000, 13000, 'background');
    leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);


    button = game.add.button(this.screenWidth - 100, this.screenHeight - 100, 'tiles', this.createTile, this, 24, 24, 24);
    button.fixedToCamera = true;

    camera = new Phaser.Camera(game, 0 , 0, 0, this.screenWidth, this.screenHeight);
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;

    this.createTile('D');

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
    console.log(cities);
    checkFinishedCities();

    tile.inputEnabled = false;
    game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
    console.log(game.world.centerX, game.world.centerY)
    this.createTile();

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.spaceKeyDown, this, 0, tile);
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

  // this.gameTiles = randomizeGameTiles(gameTiles);
  // console.log(gameTiles);

  createTile: function(type) {
    if (typeof type != 'string') {
      //var type = this.game.rnd.pick(('ABCDEFGHIJKLMNOPQRSTUVWX').split(''));
      var type = this.gameTiles.pop();
    }

    // console.log(type);
    // console.log('CreateTiles', arguments);

    tile = new Tile(game, 50, 50,  type);

    if ((tile.getValidMoves().length === 0 ) && (playedTiles.length > 0)){
      if (gameTiles.length === 0){
        //TODO -- handle this shit
        alert("Game over.");
      }
      swapTile(type);
    }
    this.game.add.existing(tile);
    // console.log('Possible moves: ',tile.getValidMoves());
  },

  swapTile: function(type){
    console.log("swapping tile")
    var tempArray = [];
    tempArray.push(type);
    gameTiles.forEach(function(currentTile){
      tempArray.push(currentTile);
    });
    gameTiles = tempArray;
    type = gameTiles.pop();
    game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
    tile = new Tile(game, 50, 50, type);
  },

  spaceKeyDown: function() {
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;
  },

  update: function() {

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
  }
};
