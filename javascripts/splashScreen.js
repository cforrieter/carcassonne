// var CarcassoneGame = {};

CarcassoneGame.splashScreen = function(game) {
  this.phaserLogo;
};

CarcassoneGame.splashScreen.prototype = {

  preload: function() {
    game.load.image('space', 'assets/starfield.png');
    game.load.image('phaserLogo', 'assets/phaser2.png');
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
  },

  goToZelda: function () {
    tween.
  },

  introTimer: function() {
    this.game.time.events.add(10000, this.goToMainMenu, this);
  },

  goToMainMenu: function() {
    this.state.start('mainMenu');
  }
};