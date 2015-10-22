// var CarcassoneGame = {};

CarcassoneGame.splashScreen = function(game) {
  this.phaserLogo;
  this.stateSwapTimer
};

var stateSwapTimer;
var bmd;
var area;
var dropTime = 0;

CarcassoneGame.splashScreen.prototype = {

  preload: function() {
    game.load.image('space', 'assets/starfield.png');
    game.load.image('phaserLogo', 'assets/phaser2.png');
    game.load.image('lhl-logo', 'assets/lhl-logo.png');
    game.load.image('node-logo', 'assets/node-logo.png');
    game.load.audio('secret', 'assets/secret.mp3');
  },

  create:  function() {
    game.add.tileSprite(0,0,800,600,'space');
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaserLogo');
    logo.anchor.set(0.5);
    logo.alpha = 0;
    var tween = game.add.tween(logo)
    tween.to( { alpha: 1 }, 2000, "Linear");
    tween.start();
    tween.onComplete.add(this.introTimer, this);
    game.input.onDown.add(this.goToZelda, this);

    var lhl = game.add.sprite(20, 550, 'lhl-logo');
    lhl.scale.setTo(0.5, 0.5);

    var node = game.add.sprite(575, 500, 'node-logo');
    node.scale.setTo(0.5,0.5);


    bmd = game.make.bitmapData(800,600);
    bmd.addToWorld();
    area = new Phaser.Rectangle(20, 550, 400, 16);
    bmd.copyRect('lhl-logo', area, 20, 550);

  },

  goToZelda: function () {
    var navi = this.game.add.audio('secret');
    navi.allowMultiple = true;
    navi.addMarker('secret', 0, 2);
    navi.play('secret');
    this.game.time.events.remove(stateSwapTimer);
  },

  introTimer: function() {
    stateSwapTimer = this.game.time.events.add(10000, this.goToMainMenu, this);
  },

  goToMainMenu: function() {
    this.state.start('mainMenu');
  },

  update: function() {
    if (area.y > 0 && game.time.now > dropTime) {
      for (var y = 0; y < area.y; y++)
      {
        bmd.copyRect('lhl-logo', area, 20, y);
      }

      area.y--;
      dropTime = game.time.now + 25;
    }
  }
};