// var CarcassoneGame = {};

CarcassoneGame.zeldaSplash = function(game) {

};

var stateSwapTimer;
var slices;
var waveform;

var xl;
var cx = 0;


CarcassoneGame.zeldaSplash.prototype = {

  preload: function() {
    gameMode = "zelda"; 
  },

  create:  function() {

    this.playWarpSound;
    game.add.tileSprite(0,0,game.width,game.height,'space');
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaserLogo');
    logo.anchor.set(0.5);
    logo.alpha = 1;
    var tween = game.add.tween(logo)
    tween.to( { alpha: 0 }, 100, "Linear");
    tween.start();
    tween.onComplete.add(this.introTimer, this);

    var lhl = game.add.sprite(20, game.height - 50, 'lhl-logo');
    lhl.scale.setTo(0.5, 0.5);

    var node = game.add.sprite(game.width -225, game.height - 100, 'node-logo');
    node.scale.setTo(0.5,0.5);

    
    // Warping the phaser logo
    var motion = { x: 0 };
    var phaserWarp = game.add.tween(motion).to( { x: 200 }, 3000, "Bounce.easeInOut", true, 0, -1, true);
    waveform = phaserWarp.generateData(60);

    xl = waveform.length - 1;

    slices = [];

    var picWidth = game.cache.getImage('phaserLogo').width;
    var picHeight = game.cache.getImage('phaserLogo').height;

    var ys = 4;

    for (var y = 0; y < Math.floor(picHeight/ys); y++)
    {
        var star = game.add.sprite(game.world.centerX, game.world.centerY - 150 + (y * ys), 'phaserLogo');

        star.crop(new Phaser.Rectangle(0, y * ys, picWidth, ys));

        star.ox = star.x;

        star.cx = game.math.wrap(y * 2, 0, xl);

        star.anchor.set(0.5);
        slices.push(star);
    }

    this.playWarpSound();
  },

  playWarpSound: function() {
    var worldWarp = this.game.add.audio('world-warp');
    worldWarp.allowMultiple = false;
    worldWarp.addMarker('world-warp',0,5);
    worldWarp.play('world-warp');
  },

  introTimer: function() {
    stateSwapTimer = this.game.time.events.add(5000, this.goToMainMenu, this);
  },

  goToMainMenu: function() {
    this.state.start('mainMenuZelda');
  },

  update: function() {
    for (var i = 0, len = slices.length; i < len; i++)
    {
      slices[i].x = slices[i].ox + waveform[slices[i].cx].x;

      slices[i].cx++;

      if (slices[i].cx > xl)
      {
          slices[i].cx = 0;
      }

    }
  }
};