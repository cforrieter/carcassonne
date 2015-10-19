
var playedTiles = []

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
    left: null,
    right: null,
    top: null,
    bottom: null
  };
  
  var kind = Tile.KINDS[type];
  if(!kind){
    throw new Error('Invalid tile type: ' + type);
  }

  for(var k in kind){
    this[k] = kind[k];
  }

}

Tile.TYPES = {
  ROAD: Symbol("ROAD"),
  CITY: Symbol("CITY"),
  TERMINATOR: Symbol("TERMINATOR"),
  CLOISTER: Symbol("CLOISTER"),
  FIELD: Symbol("FIELD")
};

Tile.FRAMES = {
  A: 1,
  B: 0,
  C: 2,
  D: 23,
  E: 15,
  F: 12,
  G: 11,
  H: 14,
  I: 13,
  J: 17,
  K: 16,
  L: 18,
  M: 8,
  N: 7,
  O: 10,
  P: 9,
  Q: 4,
  R: 3,
  S: 6,
  T: 5,
  U: 19, 
  V: 20,
  W: 21,
  X: 22
}

Tile.KINDS = {
  B: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.FIELD },
  A: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.FIELD },
  C: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.CITY,  typeLeft: Tile.TYPES.CITY  },
  R: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  Q: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  T: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  S: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  N: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  M: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  P: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  O: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.CITY  },
  G: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  F: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.CITY,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  I: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.CITY  },
  H: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.CITY,  typeLeft: Tile.TYPES.FIELD },
  E: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.FIELD },
  K: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  J: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.FIELD },
  L: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  U: { typeTop: Tile.TYPES.ROAD,  typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.FIELD },
  V: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.FIELD, typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  W: { typeTop: Tile.TYPES.FIELD, typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  X: { typeTop: Tile.TYPES.ROAD,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.ROAD,  typeLeft: Tile.TYPES.ROAD  },
  D: { typeTop: Tile.TYPES.CITY,  typeRight: Tile.TYPES.ROAD,  typeBottom: Tile.TYPES.FIELD, typeLeft: Tile.TYPES.ROAD  }
};


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

Tile.prototype.rotateRight = rotate.right;

Tile.prototype.rotateLeft = rotate.left;

Tile.prototype.leftKeyDown = function leftKeyDown() {
  this.angle -= 90;
  this.rotateLeft();
}

Tile.prototype.rightKeyDown = function rightKeyDown() {
  this.angle += 90;
  this.rotateRight();
}

// This function addes the tile placement box and confirmation dialog
Tile.prototype.onClick = function onClick(draggable, pointer){
  this.currentPointer = pointer;

  var target = { x: Math.floor((this.x + 45) / 90) * 90,
                 y: Math.floor((this.y + 45) / 90) * 90
                 };
  
  if(this.dragged){

    if (tile.placementValid(tile, target)) {
    // Stop dragging
      this.game.add.tween(this).to(target, 250).start().onComplete.add(addButtons, this);

      function addButtons() {
        tile.dragged = !tile.dragged;
        confirmDrop(target, function(confirmed){
          if (confirmed) {

            // if (tile.placementValid (tile, target.x, target.y)){
              tile.placeTile(tile, tile.x, tile.y)

              console.log('Dropped at x: ' + tile.x + ' y: ' + tile.y);

              tile.inputEnabled = false;
              game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
              game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
              tile.showMeepleSpots(tile);

            // }
          }
        }, this);
      }
    }
  } else {
    // Start dragging
    // console.log("Grabbed", this);
    this.fixedToCamera = false;
    this.dragged = !this.dragged;
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
      tile.dragged = !tile.dragged;
      callback(false);
    }
  }
}

Tile.prototype.update = function update() {
  if(this.dragged && this.currentPointer)
  {
    // console.log(this.currentPointer.worldX, this.currentPointer.worldY);
    this.x = this.currentPointer.worldX;
    this.y = this.currentPointer.worldY;
  }
}




