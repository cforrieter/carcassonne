var CarcassoneGame = {};

CarcassoneGame.splashScreen = function(game) {

  this.titleText;
  this.startGameButton;
  this.listener;
};

CarcassoneGame.splashScreen.prototype = {

  preload: function() {
    game.load.image('meeple', 'assets/MEEPLE.png');
  },

  create: function() {
    var text;
    var meep = game.add.sprite(game.world.centerX, game.world.centerY, 'meeple');
    meep.anchor.set(0.5);
    meep.inputEnabled = true;
    text = game.add.text(250, 16, 'Carcassone', {fill: '#FFFFFF'});
    meep.events.onInputDown.add(function() {
    this.state.start('mainGame')}, this);
  },

  update: function() {

  },

  render: function() {

  }
};



CarcassoneGame.mainGame = function(game) {
  this.attachedToPointer;
  this.leftKey;
  this.rightKey;
  this.spaceKey;
  this.leftKeyDown;
  this.createTiles;
}

CarcassoneGame.mainGame.prototype = {

  // var validCoords = [
  //   [3, 4, [0, 1, 2]],
  //   [4, 4, [1, 2, 3, 4]],

  // ]
  // var attachedToPointer = false;
  preload: function() {

    game.load.image('background', './assets/background.png');
    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')

  },

  createTiles: function() {
    console.log('CreateTiles', arguments);

    key = Math.floor((Math.random() * 18) + 1);
    tile = new Tile(game, 50, 50,  key);
    this.game.add.existing(tile);

  },

  create: function() {

    game.world.setBounds(0, 0, 13000, 13000);
    game.add.tileSprite(0,0, 13000, 13000, 'background');
    game.stage.backgroundColor = "#FFFFFF"
    button = game.add.button(650, 450, 'tiles', this.createTiles, this, 24, 24, 24);
    button.fixedToCamera = true;

    camera = new Phaser.Camera(game, 0 , 0, 0, 800, 600);
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;

    this.createTiles();
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.spaceKeyDown, this, 0, tile);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(this.leftKeyDown, this, 0, tile)
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(this.rightKeyDown, this, 0, tile)

  },

  createMeeple: function() {
    meeple = game.add.sprite(50, 130, 'meeple');
    meeple.anchor.setTo(0.5);
    meeple.scale.setTo(0.1);

    meeple.inputEnabled = true;
    meeple.events.onInputDown.add(onClickAttach, this, 0, meeple);
    meeple.fixedToCamera = true;
  },

  

  leftKeyDown: function() {
    tile.angle -= 90;
  },

  rightKeyDown: function() {
    tile.angle += 90;
  },

  spaceKeyDown: function() {
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;
  },

  update: function() {

    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      if(this.game.input.activePointer.position.x > 775) {
        this.game.camera.x += 8;
      }

      if(this.game.input.activePointer.position.x < 25) {
        this.game.camera.x -= 8;
      }

      if(this.game.input.activePointer.position.y < 25) {
        this.game.camera.y -= 8;
      }

      if(this.game.input.activePointer.position.y > 575) {
        this.game.camera.y += 8;
      }
    }
  },

  render: function() {
    game.debug.cameraInfo(game.camera, 32, 32, 'rgb(150, 0, 0)');
    // game.debug.pointer(game.input.activePointer, 32, 32);
  }
  //TODO: coord validation
};

window.onload = function() {
  var game = window.game = new Phaser.Game(800, 600, Phaser.CANVAS, '');
  game.state.add('splashScreen', CarcassoneGame.splashScreen);
  game.state.add('mainGame', CarcassoneGame.mainGame);
  game.state.start('splashScreen');
}