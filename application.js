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

    createTile();
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(spaceKeyDown, this, 0, tile);
  }

  function createTile() {
    var type = this.game.rnd.pick(('ABCDEFGHIJKLMNOPQRSTUVWX').split(''));

    console.log(type);
    // console.log('CreateTiles', arguments);

    tile = new Tile(game, 50, 50,  type);
    this.game.add.existing(tile);
    console.log('Possible moves: ',tile.getValidMoves());
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