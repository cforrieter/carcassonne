var startGameButton;

CarcassoneGame.mainMenu = function(game) {

};

CarcassoneGame.mainMenu.prototype = {

  preload: function() {
    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);
    game.load.image('header', 'assets/carcassone-header.png');
    game.load.image('carcassonne-coat-of-arms', 'assets/carcassonne-coat-of-arms.png');
    game.load.image('meeple-blue-flat', 'assets/meeple-blue-flat.png');
    game.load.image('normal-background', 'assets/normal-background.png');
    game.load.audio('opening-theme', 'assets/opening-theme.mp3');
  },

  create: function() {
    window.io = io();
    io.on('newGame', function(msg){
      console.log(msg);
      var name = prompt('What is your name?');
      io.emit('name', { name:name, gameID: msg.gameID, playerIndex: msg.playerIndex });
    });

    io.on('playersReady', function(msg){
      game.state.start("mainGame");
      console.log("Players ready message", msg);
      gameID = msg.gameID;
      globalPlayers = msg.players;
    });

    openingTheme = this.game.add.audio('opening-theme');
    openingTheme.onDecoded.add(this.playTheme, this);
    var background = game.add.sprite(0,0,'normal-background');
    background.scale.set(game.width/800, game.height/600);
    var header = game.add.sprite(game.width/2, 32, 'header');
    header.anchor.set(0.5,0);

    // this.prepareForStateChange();

    // Sprite for start button and animation
    // startGameButton = game.add.sprite(game.world.centerX, game.world.centerY, 'carcassonne-coat-of-arms');
    // startGameButton.anchor.set(0.5);
    // startGameButton.inputEnabled = true;

    // // Changes state from the start screen to the main game
    // startGameButton.events.onInputDown.addOnce(this.prepareForStateChange, this);
  },

  prepareForStateChange: function() {
    this.addTimer();
    this.fadeMusic();
  },

  fadeMusic: function() {
    this.game.time.events.add(9000, this.stopTheme, this);
    openingTheme.fadeOut(9000);
  },

  playTheme: function() {
    openingTheme.fadeIn(4000);
  },

  stopTheme: function() {
    openingTheme.stop();
  },

  addTimer: function() {
    // RESET this 0 delay to 1200 after development ****************
    //***********************-V-********
    this.game.time.events.add(10000, this.stateChange, this);
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
