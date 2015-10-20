var CarcassoneGame = {};

CarcassoneGame.mainMenu = function(game) {
  this.titleText;
  this.startGameButton;
  this.listener;
  this.particleBurst;
};

CarcassoneGame.mainMenu.prototype = {

  preload: function() {
    game.load.spritesheet('red-rupee', 'assets/zelda-red-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('blue-rupee', 'assets/zelda-blue-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('green-rupee', 'assets/zelda-green-rupee-spritesheet.png',8,14,3);
    game.load.image('meeple-3d-blue', 'assets/meeple-3d-blue.png');
    game.load.image('header', 'assets/carcassone-header.png');
    game.load.image('meeple-blue-flat', 'assets/meeple-blue-flat.png');
    game.load.image('background', 'assets/zelda-opening-background.png');
  },

  create: function() {

    var background = game.add.sprite(0,0, 'background');
    var header = game.add.sprite(10, 32, 'header');

    var meep = game.add.sprite(game.world.centerX, game.world.centerY, 'green-rupee');
    meep.anchor.set(0.5);
    meep.inputEnabled = true;
    var sparkle = meep.animations.add('sparkle');
    meep.animations.play('sparkle', 4, true);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('red-rupee');
    emitter.forEach(function(singleParticle) {
    singleParticle.animations.add('particleAnim');
    singleParticle.animations.play('particleAnim', 4, true);
    });
    emitter.gravity = 200;
    // meep.scale.setTo(0.20,0.20);
    
    
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