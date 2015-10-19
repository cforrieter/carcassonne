function Draggable(game, x, y, key, frame)
{
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.inputEnabled = true;
  this.fixedToCamera = true;
  this.anchor.setTo(0.5);
  this.events.onInputDown.add(this.onClick, this, 0);
  this.dragged = false;
}

// Draggable.constructor = Draggable;
Draggable.prototype = Object.create(Phaser.Sprite.prototype);

function Tile(game, x, y, type)
{
  // console.log('Tile ctor', arguments);
  Draggable.call(this, game, x, y, 'tiles', Tile.FRAMES[type]);

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

Tile.MEEPLECOORDS = {
 B: {p4: [0, 0, false], p0: [-30, -30, true]},
 A: {p4: [0, 0, false], p0: [-30, -30, true], p7: [8, 30, false]},
 C: {p4: [0, 0, false]},
 R: {p0: [0, -25, false], p6: [0, 30, true]},
 Q: {p0: [0, -25, false], p6: [0, 30, true]},
 T: {p0: [0, -25, false], p6: [-30, 30, true], p7: [0, 20, false], p8: [30, 30, true]},
 S: {p0: [0, -25, false], p6: [-30, 30, true], p7: [0, 20, false], p8: [30, 30, true]},
 N: {p1: [-30, -30, false], p4: [25, 20, true]},
 M: {p1: [-20, -30, false], p4: [25, 20, true]},
 P: {p1: [-20, -20, false], p4: [0, 0, true], p5: [5, 20, false], p8: [30, 30, true]},
 O: {p1: [-20, -20, false], p4: [0, 0, true], p5: [5, 20, false], p8: [30, 30, true]},
 G: {p0: [0, -35, true], p3: [0, -10, false], p6: [0, 30, true]},
 F: {p0: [0, -35, true], p3: [0, -10, false], p6: [0, 30, true]},
 I: {p1: [0, -30, false], p3: [-32, 0, false], p4: [5, 5, true]},
 H: {p1: [0, -30, false], p4: [0, 0, true],  p7: [0, 30, false]},
 E: {p1: [0, -30, false], p4: [0, 15, true]},
 K: {p1: [0, -30, false], p3: [-30, 0, false], p6: [-30, 30, true], p8: [25, 0, true]},
 J: {p1: [0, -30, false], p5: [10, 10, false], p6: [-25, -10, true], p8: [30, 30, true]},
 L: {p0: [-20, -20, true], p1: [0, -30, false], p3: [-25, 0, false], p5: [25, 0, false], p6: [-30, 30, true], p7: [0, 30, false], p8: [30, 30, true]},
 U: {p0: [-25, -15, true], p2: [25, 15, true], p4: [0, 0, false]},
 V: {p0: [20, -20, true], p4: [0, 0, false], p6: [-20, 20, true]},
 W: {p0: [0, -30, true], p3: [-20, 0, false], p5: [20, 0, false], p6: [-30, 30, true], p7: [0, 20, false], p8: [30, 30, true]},
 X: {p0: [-30, -30, true], p1: [0, -20, false], p2: [30, -30, true], p3: [-20, 0, false], p5: [20, 0, false], p6: [-30, 30, true], p7: [0, 20, false], p8: [30, 30, true]},
 D: {p0: [-30, -18, true], p1: [0, -30, false], p4: [-10, 0, false], p6: [0, 30, true]}
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

var playedTiles = []

// Tile.constructor = Tile;
Tile.prototype = Object.create(Draggable.prototype);

// Tile.prototype.hasNeighbours = function hasNeighbours() { return !!(this.neighbours.left || this.neighbours.right || this.neighbours.top || this.neighbours.bottom); };

Tile.prototype.rotateRight = rotate.right;
// Tile.prototype.rotateRight = function rotateRight(){
//   switch(this.type){
//     case 'B':
//     case 'C':
//     case 'X':
//       return;
//   }

//   var x = this.typeBottom, y = this.typeLeft, z = this.typeTop, w = this.typeRight;
//   this.typeLeft = x;
//   this.typeTop = y;
//   this.typeRight = z;
//   this.typeBottom = w;
// };

Tile.prototype.rotateLeft = rotate.left;

// Tile.prototype.rotateLeft = function rotateLeft(){
//   switch(this.type){
//     case 'B':
//     case 'C':
//     case 'X':
//       return;
//   }

//   var x = this.typeBottom, y = this.typeLeft, z = this.typeTop, w = this.typeRight;
//   this.typeLeft = z;
//   this.typeTop = w;
//   this.typeRight = x;
//   this.typeBottom = y;
// };

Tile.prototype.leftKeyDown = function leftKeyDown() {
  this.angle -= 90;
  this.rotateLeft();
}

Tile.prototype.rightKeyDown = function rightKeyDown() {
  this.angle += 90;
  this.rotateRight();
}



Tile.prototype.placeTile = function placeTile(newTile, x, y) {


<<<<<<< HEAD
    // console.log(`Playing tile ${newTile.type} on ${newTile.x}, ${newTile.y}`);
=======
    // console.log(`Playing tile ${newTile.tileType} on ${newTile.x}, ${newTile.y}`);
>>>>>>> warren_development

    playedTiles.forEach(function(oldTile) {

      if(oldTile.x == newTile.x && oldTile.y == newTile.y) {
         // console.log("Space occupied");
         return false;
      }
      // console.log(oldTile.x, oldTile.y, newTile.x, newTile.y);
      //Bottom Neighbour
      if(oldTile.x == newTile.x && oldTile.y + 90 == newTile.y) {
        oldTile.neighbours.top = newTile;
        newTile.neighbours.bottom = oldTile;

        if(oldTile.typeBottom != newTile.typeTop){
           // console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
           return false;
        }

        // console.log("Has top neighbour");
      }
      //Right Neighbour
      if(oldTile.y == newTile.y && oldTile.x + 90 == newTile.x){
        // console.log("Checking for right neighbour");
        oldTile.neighbours.right = newTile;
        newTile.neighbours.left = oldTile;

        if(oldTile.typeRight != newTile.typeLeft){
           // console.log(`Invalid move. ${oldTile.typeRight.toString()} does not connect with ${newTile.typeLeft.toString()}`);
           return false;
        }
        // console.log("Has right neighbour");
      }
      //Top Neighbour
      if(oldTile.x == newTile.x && oldTile.y - 90 == newTile.y) {
        oldTile.neighbours.top = newTile;
        newTile.neighbours.bottom = oldTile;

        if(oldTile.typeTop != newTile.typeBottom){
           // console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
           return false;
        }
        // console.log("Has bottom neighbour");
      }

      //Left Neighbour
      if(oldTile.y == newTile.y && oldTile.x - 90 == newTile.x){
        oldTile.neighbours.left = newTile;
        newTile.neighbours.right = oldTile;

        if(oldTile.typeLeft != newTile.typeRight) {
           // console.log(`Invalid move. ${oldTile.typeLeft.toString()} does not connect with ${newTile.typeRight.toString()}`);
           return false;
        }
        // console.log("Has left neighbour");
      }
    });
  
  playedTiles.push(newTile);
  // console.log(playedTiles);
}


Tile.prototype.placementValid = function placementValid(newTile, target){
  // if(playableTiles.length === 0)
  // {
  //   throw new Error("Out of moves");
  // }
  // var newTile = playableTiles.pop();
  // newTile.x = x;
  // newTile.y = y;

  // console.log(`Playing tile ${newTile.tileType} on ${target.x}, ${target.y}`);
  var hasNeighbour = false;
  var valid = true;

  playedTiles.forEach(function(oldTile) {
    if(oldTile.x == target.x && oldTile.y == target.y){
       // console.log("Space occupied");
       valid = false;
       return false;
    }
    // console.log(oldTile.x, oldTile.y, target.x, target.y);

    //Bottom Neighbour
    if(oldTile.x == target.x && oldTile.y + 90 == target.y){
      hasNeighbour = true;

      if(oldTile.typeBottom != newTile.typeTop){
         // console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
         valid = false;
         return false;
      }

      // console.log("Has top neighbour");
    }
    //Right Neighbour
    if(oldTile.y == target.y && oldTile.x + 90 == target.x){
      hasNeighbour = true;
      // console.log("Checking for right neighbour");

      if(oldTile.typeRight != newTile.typeLeft){
         // console.log(`Invalid move. ${oldTile.typeRight.toString()} does not connect with ${newTile.typeLeft.toString()}`);
         valid = false;
         return false;
      }
      // console.log("Has right neighbour");
    }
    //Top Neighbour
    if(oldTile.x == target.x && oldTile.y - 90 == target.y){
      hasNeighbour = true;

      if(oldTile.typeTop != newTile.typeBottom){
         // console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
         valid = false;
         return false;
      }
      // console.log("Has bottom neighbour");
    }

    //Left Neighbour
    if(oldTile.y == target.y && oldTile.x - 90 == target.x){
      hasNeighbour = true;

      if(oldTile.typeLeft != newTile.typeRight){
         // console.log(`Invalid move. ${oldTile.typeLeft.toString()} does not connect with ${newTile.typeRight.toString()}`);
         valid = false;
         return false;
      }
      // console.log("Has left neighbour");
    }
  });

  if(!hasNeighbour && playedTiles.length > 0){
    // console.log(hasNeighbour);
    // console.log(`Must be adjacent to another tile. Were playing ${newTile.tileType.toString()} on ${newTile.x.toString()}, ${newTile.y.toString()}`);
    return false;
  }

  // console.log("Done checking for valid\r\n");
  // console.log('placment is valid? ', valid);
  return valid;
}


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
<<<<<<< HEAD
              console.log('Dropped at x: ' + tile.x + ' y: ' + tile.y);
=======
              // console.log("Dropped", tile);
>>>>>>> warren_development
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

<<<<<<< HEAD
Tile.prototype.getValidMoves = function getValidMoves(){
  var possibleMovesAsStrings = [];

  playedTiles.forEach(function(oldTile){
    // if !(checkForFourNeighbours){
      if (!oldTile.neighbours.top) {
        possibleMovesAsStrings.push(oldTile.x + ',' + (oldTile.y - 90));
      }
      if (!oldTile.neighbours.right) {
        possibleMovesAsStrings.push((oldTile.x + 90) + ',' + oldTile.y);
      }
      if (!oldTile.neighbours.bottom) {
        possibleMovesAsStrings.push(oldTile.x + ',' + (oldTile.y + 90));
      }
      if (!oldTile.neighbours.left) {
        possibleMovesAsStrings.push((oldTile.x - 90) + ',' + oldTile.y);
      }
    // }
  });

  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

  //remove non-unqiue elements
  possibleMovesAsStrings = possibleMovesAsStrings.filter(onlyUnique);
  
  //convert string coords to objects
  possibleMovesAsObjects = [];
  possibleMovesAsStrings.forEach(function(stringCoords){
    var arrayCoords = stringCoords.split(',');
    possibleMovesAsObjects.push({x: parseInt(arrayCoords[0]), y: parseInt(arrayCoords[1])})
  })

  var validMoves = [];
  possibleMovesAsObjects.forEach(function(target){
    for (i = 0; i < 4; i++){
      if (tile.placementValid(tile, target)){
        var currentTarget = {
          x: target.x,
          y: target.y,
          rotation: i
        }
        validMoves.push(currentTarget);
        console.log('VALID MOVE: ',currentTarget)
      }
      tile.rotateRight();
    }
  });
  return validMoves;
}

=======
Tile.prototype.addMeeple = function addMeeple() {

  console.log('You clicked on ' + this.ghostCoords)
}

Tile.prototype.showMeepleSpots = function showMeepleSpots(tile) {
  // debugger;
  var coords = Tile.MEEPLECOORDS[tile.tileType]
  for (var key in coords) {
    var position = {
      positionKey: key,
      ghostCoords: tileRotationCoordTransform(tile, coords[key][0], coords[key][1]),
      farmer: coords[key][2]
    };
    // console.log('xCoord is: ', xCoord, 'yCoord is: ', yCoord, 'farmer is: ', farmer);
    console.log(position['ghostCoords'])
    tile.game.add.button(position['ghostCoords'][0], position['ghostCoords'][1], 'meepleGhost', tile.addMeeple, position).anchor.setTo(0.5);

  }

  function tileRotationCoordTransform (tile, localX, localY) {
    var x = localX * Math.cos(Phaser.Math.degToRad(tile.angle)) - localY * Math.sin(Phaser.Math.degToRad(tile.angle)) + tile.x;
    var y = localX * Math.sin(Phaser.Math.degToRad(tile.angle)) + localY * Math.cos(Phaser.Math.degToRad(tile.angle)) + tile.y;
    return [x, y];
  }

}


>>>>>>> warren_development

