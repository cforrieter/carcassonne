window.onload = function() {

  var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
  var validCoords = [
    [3, 4, [0, 1, 2]],
    [4, 4, [1, 2, 3, 4]],

  ]
  var attachedToPointer = false;
  function preload () {

    game.load.spritesheet('tiles', 'assets/tiles_sprite.png', 88, 88, 24);

  }

  var leftKey;
  var rightKey;

  function create () {

    button = game.add.button(700, 500, 'tiles', createTiles, this, 24, 24, 24);

    camera = new Phaser.Camera(game, 0 , game.world.centerX, game.world.centerY, 800, 600);

    topCameraPan = new Phaser.Rectangle(0, 0, 800, 50);
    rightCameraPan = new Phaser.Rectangle(750, 0, 50, 600);
    bottomCameraPan = new Phaser.Rectangle(0, 550, 800, 50);
    leftCameraPan = new Phaser.Rectangle(0, 0, 50, 600);

    topCameraPan.inputEnabled = true;
    rightCameraPan.inputEnabled = true;
    bottomCameraPan.inputEnabled = true;
    leftCameraPan.inputEnabled = true;

    // game.input.addMoveCallback(p, this);

    game.world.setBounds(0, 0, 1920, 1920);
    createTiles(1);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(leftKeyDown, this, 0, tile)
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(rightKeyDown, this, 0, tile)

  }

  function createTiles() {

    key = Math.floor((Math.random() * 18) + 1);

    shadow = game.add.sprite(47, 47, 'tiles', key);
    shadow.anchor.setTo(0.5)
    shadow.tint = 0x000000;
    shadow.alpha = 0.6;

    tile = game.add.sprite(45, 45, 'tiles', key);
    tile.anchor.setTo(0.5);

    game.stage.backgroundColor = "#FFFFFF"
    tile.inputEnabled = true;
    // tile.input.enableDrag(false, true);
    tile.events.onInputDown.add(onClickAttach, this, tile);
    tile.input.enableSnap(90, 90, false, true)
    // tile.events.onDragStop.add(onDragStop, this);

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

  function onClickAttach() {
    if(attachedToPointer) {
      attachedToPointer = false;
      tile.inputEnabled = false;
      tile.position.x = Math.floor((tile.position.x + 45) / 90) * 90
      tile.position.y = Math.floor((tile.position.y + 45) / 90) * 90
    } else {
      attachedToPointer = true;
    }

  }

  function update () {

    if(attachedToPointer){
      console.log('tile: ', tile.position, 'pointer: ', this.game.input.activePointer.world)
      tile.position.x = this.game.input.activePointer.worldX;
      tile.position.y = this.game.input.activePointer.worldY;
    }

    // TODO: dry this out
    if (this.game.input.activePointer.withinGame) {
      if(this.game.input.activePointer.position.x > 750) {
        var acc = 1;
        this.game.camera.x += 5 + acc;
        if (acc <= 5) {
          acc += 1;
        }
      }

      if(this.game.input.activePointer.position.x < 50) {
        var acc = 1;
        this.game.camera.x -= 5 + acc;
        if (acc <= 5) {
          acc += 1;
        }
      }

      if(this.game.input.activePointer.position.y < 50) {
        var acc = 1;
        this.game.camera.y -= 5 + acc;
        if (acc <= 5) {
          acc += 1;
        }
      }

      if(this.game.input.activePointer.position.y > 550) {
        var acc = 1;
        this.game.camera.y += 5 + acc;
        if (acc <= 5) {
          acc += 1;
        }
      }
    }
  }

  function render() {

    game.debug.cameraInfo(game.camera, 32, 32, 'rgb(150, 0, 0)');

    game.context.fillStyle = 'rgba(255, 0, 0, 0.6)';
    game.context.fillRect(topCameraPan.x, topCameraPan.y, topCameraPan.width, topCameraPan.height);
    game.context.fillRect(leftCameraPan.x, leftCameraPan.y, leftCameraPan.width, leftCameraPan.height);
    game.context.fillRect(rightCameraPan.x, rightCameraPan.y, rightCameraPan.width, rightCameraPan.height);
    game.context.fillRect(bottomCameraPan.x, bottomCameraPan.y, bottomCameraPan.width, bottomCameraPan.height);
    // game.debug.pointer(game.input.activePointer, 32, 32);
  }

  // function moveValid(sprite) {
  //   validCoords.forEach (function(coords) {
  //     if
  //   })
  // }





};