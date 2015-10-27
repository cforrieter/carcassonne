var startGameButton;

CarcassoneGame.mainMenuZelda = function(game) {

};

CarcassoneGame.mainMenuZelda.prototype = {

  preload: function() {
    game.load.spritesheet('tiles', 'assets/zelda-tilesprite.png', 88, 88, 24);
    game.load.spritesheet('link-spin', 'assets/link-spin-spritesheet.png',40,46,14);
    game.load.spritesheet('red-rupee', 'assets/zelda-red-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('blue-rupee', 'assets/zelda-blue-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('green-rupee', 'assets/zelda-green-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('yellow-rupee', 'assets/zelda-yellow-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('orange-rupee', 'assets/zelda-orange-rupee-spritesheet.png',8,14,3);
    game.load.spritesheet('purple-rupee', 'assets/zelda-purple-rupee-spritesheet.png',8,14,3);
    game.load.image('header', 'assets/carcassone-header.png');
    game.load.image('background', 'assets/zelda-opening-background.png');
  },

  create: function() {
    
    var background = game.add.sprite(0,0, 'background');
    var header = game.add.sprite(game.width/2, 32, 'header');
    header.anchor.set(0.5,0);
    zeldaTheme = this.game.add.audio('zelda-theme');
    zeldaTheme.onDecoded.add(this.playTheme, this);
    rupeeBurst = this.game.add.audio('rupee-gained');
    swordSpin = this.game.add.audio('sword-spin-complete');


    // Sprite for start button and animation
    startGameButton = game.add.sprite(game.world.centerX, game.world.centerY, 'link-spin');
    startGameButton.anchor.set(0.5);
    startGameButton.scale.x = 3;
    startGameButton.scale.y = 3;
    startGameButton.inputEnabled = true;
    
    // Used for rupee burst on click
    game.physics.startSystem(Phaser.Physics.ARCADE);
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles(['green-rupee', 'blue-rupee', 'red-rupee', 'yellow-rupee', 'orange-rupee', 'purple-rupee']);
    emitter.forEach(function(singleParticle) {
    singleParticle.animations.add('particleAnim');
    singleParticle.animations.play('particleAnim', 4, true);
    });
    emitter.gravity = 200;

    this.prepareRupeeSound();
    this.prepareSwordSpin();
    game.input.onDown.add(this.particleBurst, this);
    game.input.onDown.add(this.playRupeeSound, this);
    // startGameButton.scale.setTo(0.20,0.20);
    
    // Changes state from the start screen to the main game
    startGameButton.events.onInputDown.add(this.prepareForStateChange, this);
  },

  prepareForStateChange: function() {
    this.addTimer();
    this.changeSprite();
    this.fadeMusic();
  },

  fadeMusic: function() {
    this.game.time.events.add(1900, this.stopTheme, this);
    zeldaTheme.fadeOut(1900);
  },

  prepareRupeeSound: function() { 
    rupeeBurst.allowMultiple = false;
    rupeeBurst.addMarker('rupee-gained',0,1);
  },

  prepareSwordSpin: function() {
    swordSpin.allowMultiple = false;
    swordSpin.addMarker('sword-spin-complete',0,2);
  },

  playRupeeSound: function() {
    rupeeBurst.play('rupee-gained');
  },

  playSwordSpin: function() {
    swordSpin.play('sword-spin-complete');
  },

  playTheme: function() {
    zeldaTheme.fadeIn(4000);
  },

  stopTheme: function() {
    zeldaTheme.stop();
  },

  changeSprite: function() {
    this.playSwordSpin();
    startGameButton.inputEnabled = false;
    startGameButton.animations.add('spin');
    startGameButton.animations.play('spin', 20, false);
  },

  addTimer: function() {
    // RESET this 0 delay to 1200 after development ****************
    //***********************-V-********
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
  },
};