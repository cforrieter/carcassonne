var playedTiles = [];
var gameOver = false;

function Tile(game, x, y, type)
{
  // console.log('Tile ctor', arguments);
  // Phaser.Sprite.call(this, game, x, y, key, frame);
  // Draggable.call(this, game, x, y, 'tiles', Tile.FRAMES[type]);

  Phaser.Sprite.call(this, game, x, y, 'tiles', Tile.FRAMES[type]);
  this.inputEnabled = true;
  this.fixedToCamera = true;
  this.anchor.setTo(0.5);
  this.events.onInputDown.add(this.onClick, this, 0);
  this.dragged = false;
  this.dropped = false;

  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

  leftKey.onDown.add(this.leftKeyDown, this, 0)
  rightKey.onDown.add(this.rightKeyDown, this, 0)

  this.tileType = type;
  this.typeLeft = null;
  this.typeRight = null;
  this.typeTop = null;
  this.typeBottom = null;
  this.neighbours = {
    typeLeft: null,
    typeRight: null,
    typeTop: null,
    typeBottom: null
  };

  var kind = Tile.KINDS[type];
  // if(!kind){
  //   throw new Error('Invalid tile type: ' + type);
  // }

  for(var k in kind){
    this[k] = kind[k];
  }

}



// // TILE COORD POINTS
// // xA   xB   xC
// // xD   xE   xF
// // xG   xH   xI
// // -------------------

// Tile.PTS = {
//   xA: [0 + 90 * sin(degToRad(this.angle)), 90 - 90 * cos(degToRad(this.angle))],
//   xB: [45 + 45 * sin(degToRad(this.angle)), 45 - 45 * cos(degToRad(this.angle))],
//   xC: [0 + 90 * sin(degToRad(this.angle + 90)), 90 - 90 * cos(degToRad(this.angle + 90))],

//   xD: [45 + 45 * sin(degToRad(this.angle + 270)), 45 - 45 * cos(degToRad(this.angle + 270))],
//   xE: [45, 45],
//   xF: [45 + 45 * sin(degToRad(this.angle + 90)), 45 - 45 * cos(degToRad(this.angle + 90))],

//   xG: [0 + 90 * sin(degToRad(this.angle + 270)), 90 - 90 * cos(degToRad(this.angle + 270))],
//   xH: [45 + 45 * sin(degToRad(this.angle + 180)), 45 - 45 * cos(degToRad(this.angle + 180))],
//   xI: [0 + 90 * sin(degToRad(this.angle + 180)), 90 - 90 * cos(degToRad(this.angle + 180))]
//   };

// Tile.ROADS = {
//   B: [],
//   A: [[xE, xH]],
//   C: [],
//   R: [],
//   Q: [],
//   T: [[xE, xH]],
//   S: [[xE, xH]],
//   N: [],
//   M: [],
//   P: [[xH, xF]],
//   O: [[xH, xF]],
//   G: [],
//   F: [],
//   I: [],
//   H: [],
//   E: [],
//   K: [[xD, xH]],
//   J: [[xH, xF]],
//   L: [[xD, xE], [xE, xF], [xE, xH]],
//   U: [[xB, xH]],
//   V: [[xD, xH]],
//   W: [[xD, xE], [xE, xF], [xE, xH]],
//   X: [[xD, xE], [xB, xE], [xF, xE], [xH, xE]],
//   D: [[xD, xF]]

// };



Tile.prototype = Object.create(Phaser.Sprite.prototype);

// Tile.prototype.hasNeighbours = function hasNeighbours() { return !!(this.neighbours.left || this.neighbours.right || this.neighbours.top || this.neighbours.bottom); };

// This function addes the tile placement box and confirmation dialog
Tile.prototype.onClick = function onClick(draggable, pointer){
  this.currentPointer = pointer;
  // tile.grabbed = true;

  var target = { x: Math.floor((this.x + 45) / 90) * 90,
                 y: Math.floor((this.y + 45) / 90) * 90
                 };

  if(this.dragged){

    if (tile.placementValid(tile, target)) {
      // Stop dragged

      if (!tile.dropped) {
        tile.dropped = true;
        this.game.add.tween(this).to(target, 250).start().onComplete.add(addButtons, this);
      }

      function addButtons() {
          confirmDrop(target, function(confirmed){
            if (confirmed) {
              // var meepleEdges = [];
              // if (tile.placementValid (tile, target.x, target.y)){
              tile.placeTile(tile, tile.x, tile.y);

              var roadEdges = (addToRoad(tile));
              // console.log("Road edges: ", roadEdges)

              //TODO: get cities uncommented and tested *********

              var cityEdges = (addToCity(tile));

              // cities.forEach(function(city){
              //   console.log("Banner count: ",city.bannerCount);
              // });
              // console.log(cities);
              // console.log("City edges: ", cityEdges)
              // console.log("Valid meeples for cities are " + meepleEdges);
              // console.log(cities);



              //*********************
              // console.log('Dropped at x: ' + tile.x + ' y: ' + tile.y);

              tile.inputEnabled = false;
              game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
              game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);

              tile.showMeepleSpots(tile, roadEdges, cityEdges);



            // }
          }
        }, this);
      }
    }
  } else {
    // Start dragged
    // console.log("Grabbed", this);
    this.fixedToCamera = false;
    this.dragged = true;
  }

  function confirmDrop(target, callback, tile) {

    var confirm = tile.game.add.button(target.x + 60, target.y - 30, 'check', confirm, this, 23, 23, 23);
    confirm.scale.setTo(0.3);
    var decline = tile.game.add.button(target.x - 45, target.y - 45, 'tileBorder', decline, this);

    function confirm() {
      confirm.destroy();
      decline.destroy();
      callback(true);
    }

    function decline() {
      confirm.destroy();
      decline.destroy();
      tile.dragged = true;
      tile.dropped = false;
      callback(false);
    }
  }
}

Tile.prototype.update = function update() {
  if(this.dragged && this.currentPointer && !this.dropped)
  {
    // console.log(this.currentPointer.worldX, this.currentPointer.worldY);
    this.x = this.currentPointer.worldX;
    this.y = this.currentPointer.worldY;
  }


}
