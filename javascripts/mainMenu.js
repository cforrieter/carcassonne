var CarcassoneGame = {};

CarcassoneGame.mainMenu = function(game) {
  // this.titleText;
  // this.startGameButton;
  // this.listener;
  // this.particleBurst;
};

CarcassoneGame.mainMenu.prototype = {

  preload: function() {
    game.load.image('meeple-3d-blue', 'assets/meeple-3d-blue.png');
    game.load.image('header', 'assets/carcassone-header.png');
    game.load.image('meeple-blue-flat', 'assets/meeple-blue-flat.png');
  },

  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('meeple-3d-blue');
    emitter.gravity = 200;

    var meep = game.add.sprite(game.world.centerX, game.world.centerY, 'meeple-3d-blue');
    meep.anchor.set(0.5);
    meep.inputEnabled = true;
    meep.scale.setTo(0.20,0.20);
    var header = game.add.sprite(10, 32, 'header');
    meep.events.onInputDown.add(function() {
    this.state.start('mainGame')}, this);
    game.input.onDown.add(this.particleBurst, this);
  },

  particleBurst: function(pointer) {

    //  Position the emitter where the mouse/touch event was
    emitter.x = pointer.x;
    emitter.y = pointer.y;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    emitter.start(true, 4000, null, 5);
  }
};