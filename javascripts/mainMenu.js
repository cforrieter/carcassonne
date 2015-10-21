var CarcassoneGame = {};
var startGameButton;

CarcassoneGame.mainMenu = function(game) {
  this.titleText;
  this.startGameButton;
  this.listener;
  this.particleBurst;
};

CarcassoneGame.mainMenu.prototype = {

  preload: function() {
    game.load.spritesheet('link-spin', 'assets/link-spin-spritesheet.png',40,46,14);
    game.load.spritesheet('red-rupee', 'assets/zelda-red-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('blue-rupee', 'assets/zelda-blue-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('green-rupee', 'assets/zelda-green-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('yellow-rupee', 'assets/zelda-yellow-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('orange-rupee', 'assets/zelda-orange-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('purple-rupee', 'assets/zelda-purple-rupee-spritesheet.png',8,14,3);
    game.load.image('meeple-3d-blue', 'assets/meeple-3d-blue.png');
    game.load.image('header', 'assets/carcassone-header.png');
    game.load.image('meeple-blue-flat', 'assets/meeple-blue-flat.png');
    game.load.image('background', 'assets/zelda-opening-background.png');
  },

  create: function() {

    var background = game.add.sprite(0,0, 'background');
    var header = game.add.sprite(10, 32, 'header');

    // Sprite for start button and animation
    startGameButton = game.add.sprite(game.world.centerX, game.world.centerY, 'link-spin');
    startGameButton.anchor.set(0.5);
    startGameButton.scale.x = 3;
    startGameButton.scale.y = 3;
    startGameButton.inputEnabled = true;
    
    

    // Used for rupee burst on click
    game.physics.startSystem(Phaser.Physics.ARCADE);
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('orange-rupee');
    emitter.forEach(function(singleParticle) {
    singleParticle.animations.add('particleAnim');
    singleParticle.animations.play('particleAnim', 4, true);
    });
    emitter.gravity = 200;
    game.input.onDown.add(this.particleBurst, this);
    console.log(String(this.randomRupees()));
    // startGameButton.scale.setTo(0.20,0.20);
    
    // Changes state from the start screen to the main game
    startGameButton.events.onInputDown.add(this.addTimer, this);
    startGameButton.events.onInputDown.add(this.changeSprite, this);
  },

  randomRupees: function(){
    var particles = ['green-rupee', 'blue-rupee', 'red-rupee', 'yellow-rupee', 'orange-rupee', 'purple-rupee']
    return particles[Math.floor((Math.random() * particles.length) + 1)];
  },

  changeSprite: function() {
    startGameButton.animations.add('spin');
    startGameButton.animations.play('spin', 20, false);
  },

  addTimer: function() {
    this.game.time.events.add(3000, this.stateChange, this);
  },

  stateChange: function() {
    this.state.start('mainGame');
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