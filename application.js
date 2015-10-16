window.onload = function() {

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

  function preload () {

    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 23);

  }

  var leftKey;
  var rightKey;

  function create () {

    createTiles(1);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(leftKeyDown, this, 0, tile)
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(rightKeyDown, this, 0, tile)

  }

  function createTiles(key) {

    shadow = game.add.sprite(47, 47, 'tiles', key);
    shadow.anchor.setTo(0.5, 0.5)
    shadow.tint = 0x000000;
    shadow.alpha = 0.6;

    tile = game.add.sprite(45, 45, 'tiles', key);
    tile.anchor.setTo(0.5, 0.5);

    game.stage.backgroundColor = "#FFFFFF"
    tile.inputEnabled = true;
    tile.input.enableDrag(false, true);
    tile.events.onInputDown.add(listener, this, tile);
    tile.input.enableSnap(90, 90, false, true)
    tile.events.onDragStop.add(onDragStop, this);

 

  }

  function onDragStop(sprite) {
    // TODO:: if top left pixel is not valid location then return;
    console.log('dropped at: ' + sprite.x + ',y :' + sprite.y + ' angle: '+ sprite.angle)
  }

  function leftKeyDown() {
    tile.angle -= 90;
  }

  function rightKeyDown() {
    tile.angle += 90;
  }

  function listener() {
    tileNum = Math.floor((Math.random() * 18) + 1);
    createTiles(tileNum);
  }

  function update () {



  }

};