var CarcassoneGame = {};
var gameMode = "normal";

CarcassoneGame.splashScreen = function(game) {
  this.addInput;
};


var stateSwapTimer;
var slices;
var waveform;

var xl;
var cx = 0;

var KONAMI_CODE = ['up','up','down','down','left','right','left','right', 'b', 'a'];
var userInputs = [];


CarcassoneGame.splashScreen.prototype = {

  preload: function() {
    game.load.image('space', 'assets/starfield.png');
    game.load.image('phaserLogo', 'assets/phaser2.png');
    game.load.image('lhl-logo', 'assets/lhl-logo.png');
    game.load.image('node-logo', 'assets/node-logo.png');
    game.load.image('waiting-for-players', 'assets/waiting-for-players.png')
    game.load.audio('secret', 'assets/secret.mp3');
    game.load.audio('rupee-gained', 'assets/rupee-gained.mp3');
    game.load.audio('sword-spin-complete', 'assets/sword-spin-complete.mp3');
    game.load.audio('world-warp', 'assets/world-warp.mp3');
    game.load.audio('zelda-theme', 'assets/zelda-theme.mp3');
  },

  create:  function() {
    game.add.tileSprite(0,0, game.width, game.height,'space');
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaserLogo');
    logo.anchor.set(0.5);
    logo.alpha = 0;
    var tween = game.add.tween(logo)
    tween.to( { alpha: 1 }, 2000, "Linear");
    tween.start();
    tween.onComplete.add(this.introTimer, this);
    // game.input.onDown.add(this.goToZelda, this);

    var lhl = game.add.sprite(25, game.height - 50, 'lhl-logo');
    lhl.scale.setTo(0.5, 0.5);

    var node = game.add.sprite(game.width - 225, game.height - 100, 'node-logo');
    node.scale.setTo(0.5,0.5);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    bKey = game.input.keyboard.addKey(Phaser.Keyboard.B);

    upKey.onDown.add(function() {
      userInputs.unshift('up')
    }, this);
    downKey.onDown.add(function() {
      userInputs.unshift('down')
    }, this);
    leftKey.onDown.add(function() {
      userInputs.unshift('left')
    }, this);
    rightKey.onDown.add(function() {
      userInputs.unshift('right')
    }, this);
    aKey.onDown.add(function() {
      userInputs.unshift('a')
    }, this);
    bKey.onDown.add(function() {
      userInputs.unshift('b')
    }, this);
  },

  goToZelda: function () {
    var navi = this.game.add.audio('secret');
    navi.allowMultiple = false;
    navi.addMarker('secret', 0, 2);
    navi.play('secret');
    this.game.time.events.remove(stateSwapTimer);
    stateSwapTimer = this.game.time.events.add(5000, this.goToZeldaSplash, this);
  },

  introTimer: function() {
    stateSwapTimer = this.game.time.events.add(5000, this.goToMainMenu, this);
  },

  goToMainMenu: function() {
    this.state.start('mainMenu');
  },

  goToZeldaSplash: function() {
    this.state.start('zeldaSplash');
  },

  update: function() {
    if(KONAMI_CODE.join('') == userInputs.slice(0,10).reverse().join('')) {
      this.goToZelda();
      userInputs = [];
    }
  }
};