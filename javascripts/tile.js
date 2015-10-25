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
  this.grabbed = false;

  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

  leftKey.onDown.add(this.leftKeyDown, this, 0);
  rightKey.onDown.add(this.rightKeyDown, this, 0);

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

  var farmEdges = Tile.FARMS[type];
  this.farms = [];

  for(var f in farmEdges){
    var farm = {edges: [], hasCity: false}
    farm.edges = farmEdges[f].edges.split('');
    farm.hasCity = farmEdges[f].hasCity;
    farm.position = farmEdges[f].position;
    this.farms.push(farm);
  }

  var kind = Tile.KINDS[type];
  // if(!kind){
  //   throw new Error('Invalid tile type: ' + type);
  // }

  for(var k in kind){
    this[k] = kind[k];
  }

}

Tile.prototype = Object.create(Phaser.Sprite.prototype);

// Tile.prototype.hasNeighbours = function hasNeighbours() { return !!(this.neighbours.left || this.neighbours.right || this.neighbours.top || this.neighbours.bottom); };

// This function addes the tile placement box and confirmation dialog
Tile.prototype.onClick = function onClick(draggable, pointer){
  this.currentPointer = pointer;
  tile.grabbed = true;

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
              var farmerEdges = (addFarms(tile));

              // console.log("Cities:");
              // cities.forEach(function(city){
              //   console.log(city);
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

              tile.showMeepleSpots(tile, roadEdges, cityEdges, farmerEdges);



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
