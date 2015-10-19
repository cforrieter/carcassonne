window.onload = function() {

  var game = window.game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

  var meepleCoords = [

  ]

  // var attachedToPointer = false;
  function preload () {

    game.load.image('background', './assets/background.png');
    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);
    game.load.image('meeple', 'assets/MEEPLE.png')
    game.load.image('meepleGhost', 'assets/MEEPLE_ghost.png')
    game.load.image('check', 'assets/check.png')
    game.load.image('tileBorder', 'assets/border.png')

  }

  var leftKey;
  var rightKey;
  var spaceKey;

  function create () {

    game.world.setBounds(0, 0, 13000, 13000);
    game.add.tileSprite(0,0, 13000, 13000, 'background');
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    // game.stage.backgroundColor = "#FFFFFF"

    button = game.add.button(650, 450, 'tiles', createTile, this, 24, 24, 24);
    button.fixedToCamera = true;

    camera = new Phaser.Camera(game, 0 , 0, 0, 800, 600);
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;

    createTile();
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(spaceKeyDown, this, 0, tile);


  }

  // function createMeeple() {

  //   meeple = game.add.sprite(50, 130, 'meeple');
  //   meeple.anchor.setTo(0.5);
  //   meeple.scale.setTo(0.1);

  //   meeple.inputEnabled = true;
  //   meeple.events.onInputDown.add(onClickAttach, this, 0, meeple);
  //   meeple.fixedToCamera = true;
  // }

  function createTile() {
    var type = this.game.rnd.pick(('ABCDEFGHIJKLMNOPQRSTUVWX').split(''));
    console.log(type);
    // console.log('CreateTiles', arguments);

    // frame = Math.floor((Math.random() * 18) + 1);
    tile = new Tile(game, 50, 50,  type);
    this.game.add.existing(tile);
    console.log('Possible moves: ',tile.getValidMoves());

  }

  function spaceKeyDown() {
    this.game.camera.x = game.world.centerX;
    this.game.camera.y = game.world.centerY;
  }

  function update () {

    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      if(this.game.input.activePointer.position.x > 775) {
        this.game.camera.x += 8;
      }

      if(this.game.input.activePointer.position.x < 25) {
        this.game.camera.x -= 8;
      }

      if(this.game.input.activePointer.position.y < 25) {
        this.game.camera.y -= 8;
      }

      if(this.game.input.activePointer.position.y > 575) {
        this.game.camera.y += 8;
      }
    }
  }

  function render() {

    // game.debug.cameraInfo(game.camera, 32, 32, 'rgb(150, 0, 0)');
    // game.debug.pointer(game.input.activePointer, 32, 32);
  }
  //TODO: coord validation

  // function moveValid(sprite) {
  //   validCoords.forEach (function(coords) {
  //     if
  //   })
  // }


};