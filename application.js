// var rotate = require('./rotate');

window.onload = function() {

  var screenWidth = 800;
  var screenHeight = 600;

  var game = window.game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
  

  // var attachedToPointer = false;
  function preload () {

    game.load.image('background', './assets/background.png');
    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')
    game.load.image('check', 'assets/check.png')
    game.load.image('tileBorder', 'assets/border.png')
    game.load.image('blueMeeple', 'assets/blueMeeple2.png')
    game.load.image('meepleFarmer', 'assets/meepleFarmer.png')

  }

  var spaceKey;

  function create () {

    game.world.setBounds(0, 0, 13000, 13000);
    game.add.tileSprite(0,0, 13000, 13000, 'background');
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);


    button = game.add.button(screenWidth - 100, screenHeight - 100, 'tiles', createTile, this, 24, 24, 24);
    button.fixedToCamera = true;

    camera = new Phaser.Camera(game, 0 , 0, 0, screenWidth, screenHeight);
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;

    createTile('D');

    tile.fixedToCamera = false;

    //TODO, dry this out--code from tile.js dropping a tile
    tile.x = game.world.centerX + screenWidth/2;
    tile.y = game.world.centerY + screenHeight/2;
    tile.x = Math.floor((tile.x + 45) / 90) * 90;
    tile.y = Math.floor((tile.y + 45) / 90) * 90;
    tile.placeTile(tile, game.world.centerX, game.world.centerY);
    tile.inputEnabled = false;
    game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
    console.log(game.world.centerX, game.world.centerY)
    createTile();

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(spaceKeyDown, this, 0, tile);
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

  var gameTiles = 'AABBBBCDDDEEEEEFFGHHHIIJJJKKKLLLMMNNNOOPPPQRRRSSTUUUUUUUUVVVVVVVVVWWWWX'.split('') 
  gameTiles = randomizeGameTiles(gameTiles);
  // console.log(gameTiles);

  function createTile(type) {
    if (typeof type != 'string') {
      // var type = this.game.rnd.pick(('ABCDEFGHIJKLMNOPQRSTUVWX').split(''));
      var type = gameTiles.pop();
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
  }

  function swapTile(type){
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
  }

  function spaceKeyDown() {
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;
  }

  function update () {

    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      if(this.game.input.activePointer.position.x > screenWidth - 25) {
        this.game.camera.x += 8;
      }

      if(this.game.input.activePointer.position.x < 25) {
        this.game.camera.x -= 8;
      }

      if(this.game.input.activePointer.position.y < 25) {
        this.game.camera.y -= 8;
      }

      if(this.game.input.activePointer.position.y > screenHeight - 25) {
        this.game.camera.y += 8;
      }
    }
  }

  function render() {

    // game.debug.cameraInfo(game.camera, 32, 32, 'rgb(150, 0, 0)');
    // game.debug.pointer(game.input.activePointer, 32, 32);
  }
};