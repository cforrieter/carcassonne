var startGameButton;

CarcassoneGame.mainMenu = function(game) {

};

CarcassoneGame.mainMenu.prototype = {

  preload: function() {
    game.load.image('header', 'assets/carcassone-header.png');
    game.load.image('meeple-blue-flat', 'assets/meeple-blue-flat.png');
    game.load.image('normal-background', 'assets/normal-background.png');
  },

  create: function() {
    
    var background = game.add.sprite(0,0, 'normal-background');
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
    startGameButton.events.onInputDown.addOnce(this.prepareForStateChange, this);
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
    startGameButton.animations.add('spin');
    startGameButton.animations.play('spin', 20, false);
  },

  addTimer: function() {
    // RESET this 0 delay to 1200 after development ****************
    //***********************-V-********
    this.game.time.events.add(0, this.stateChange, this);
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