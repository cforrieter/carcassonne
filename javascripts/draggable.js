function Draggable(game, x, y, key, frame)
{
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.inputEnabled = true;
  this.fixedToCamera = true;
  this.anchor.setTo(0.5);
  this.events.onInputDown.add(this.onClick, this, 0);
  this.dragged = false;
}

Draggable.constructor = Draggable;
Draggable.prototype = Object.create(Phaser.Sprite.prototype);

function Tile(game, x, y, type)
{
  console.log('Tile ctor', arguments);
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
  w: 21,
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

var playedTiles = []

Tile.constructor = Tile;
Tile.prototype = Object.create(Draggable.prototype);

// Tile.prototype.hasNeighbours = function hasNeighbours() { return !!(this.neighbours.left || this.neighbours.right || this.neighbours.top || this.neighbours.bottom); };

Tile.prototype.rotateRight = function rotateRight(){
  switch(this.type){
    case 'B':
    case 'C':
    case 'X':
      return;
  }

  var x = this.typeBottom, y = this.typeLeft, z = this.typeTop, w = this.typeRight;
  this.typeLeft = x;
  this.typeTop = y;
  this.typeRight = z;
  this.typeBottom = w;
};

Tile.prototype.rotateLeft = function rotateLeft(){
  switch(this.type){
    case 'B':
    case 'C':
    case 'X':
      return;
  }

  var x = this.typeBottom, y = this.typeLeft, z = this.typeTop, w = this.typeRight;
  this.typeLeft = z;
  this.typeTop = w;
  this.typeRight = x;
  this.typeBottom = y;
};

Tile.prototype.leftKeyDown = function leftKeyDown() {
  this.angle -= 90;
  this.rotateLeft();
}

Tile.prototype.rightKeyDown = function rightKeyDown() {
  this.angle += 90;
  this.rotateRight();
}



Tile.prototype.placeTile = function placeTile(newTile, x, y) {


    console.log(`Playing tile ${newTile.type} on ${newTile.x}, ${newTile.y}`);

    playedTiles.forEach(function(oldTile) {

      if(oldTile.x == newTile.x && oldTile.y == newTile.y) {
         console.log("Space occupied");
         return false;
      }
      console.log(oldTile.x, oldTile.y, newTile.x, newTile.y);
      //Bottom Neighbour
      if(oldTile.x == newTile.x && oldTile.y + 90 == newTile.y) {
        oldTile.neighbours.top = newTile;
        newTile.neighbours.bottom = oldTile;

        if(oldTile.typeBottom != newTile.typeTop){
           console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
           return false;
        }

        console.log("Has top neighbour");
      }
      //Right Neighbour
      if(oldTile.y == newTile.y && oldTile.x + 90 == newTile.x){
        console.log("Checking for right neighbour");
        oldTile.neighbours.right = newTile;
        newTile.neighbours.left = oldTile;

        if(oldTile.typeRight != newTile.typeLeft){
           console.log(`Invalid move. ${oldTile.typeRight.toString()} does not connect with ${newTile.typeLeft.toString()}`);
           return false;
        }
        console.log("Has right neighbour");
      }
      //Top Neighbour
      if(oldTile.x == newTile.x && oldTile.y - 90 == newTile.y) {
        oldTile.neighbours.top = newTile;
        newTile.neighbours.bottom = oldTile;

        if(oldTile.typeTop != newTile.typeBottom){
           console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
           return false;
        }
        console.log("Has bottom neighbour");
      }

      //Left Neighbour
      if(oldTile.y == newTile.y && oldTile.x - 90 == newTile.x){
        oldTile.neighbours.left = newTile;
        newTile.neighbours.right = oldTile;

        if(oldTile.typeLeft != newTile.typeRight) {
           console.log(`Invalid move. ${oldTile.typeLeft.toString()} does not connect with ${newTile.typeRight.toString()}`);
           return false;
        }
        console.log("Has left neighbour");
      }
    });
  
  playedTiles.push(newTile);
}


Tile.prototype.placementValid = function placementValid(newTile, x, y){
  // if(playableTiles.length === 0)
  // {
  //   throw new Error("Out of moves");
  // }
  // var newTile = playableTiles.pop();
  newTile.x = x;
  newTile.y = y;

  console.log(`Playing tile ${newTile.tileType} on ${newTile.x}, ${newTile.y}`);
  var hasNeighbour = false;
  var valid = true;

  playedTiles.forEach(function(oldTile) {
    if(oldTile.x == newTile.x && oldTile.y == newTile.y){
       console.log("Space occupied");
       valid = false;
       return false;
    }
    console.log(oldTile.x, oldTile.y, newTile.x, newTile.y);

    //Bottom Neighbour
    if(oldTile.x == newTile.x && oldTile.y + 90 == newTile.y){
      hasNeighbour = true;

      if(oldTile.typeBottom != newTile.typeTop){
         console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
         valid = false;
         return false;
      }

      console.log("Has top neighbour");
    }
    //Right Neighbour
    if(oldTile.y == newTile.y && oldTile.x + 90 == newTile.x){
      hasNeighbour = true;
      console.log("Checking for right neighbour");

      if(oldTile.typeRight != newTile.typeLeft){
         console.log(`Invalid move. ${oldTile.typeRight.toString()} does not connect with ${newTile.typeLeft.toString()}`);
         valid = false;
         return false;
      }
      console.log("Has right neighbour");
    }
    //Top Neighbour
    if(oldTile.x == newTile.x && oldTile.y - 90 == newTile.y){
      hasNeighbour = true;

      if(oldTile.typeTop != newTile.typeBottom){
         console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
         valid = false;
         return false;
      }
      console.log("Has bottom neighbour");
    }

    //Left Neighbour
    if(oldTile.y == newTile.y && oldTile.x - 90 == newTile.x){
      hasNeighbour = true;

      if(oldTile.typeLeft != newTile.typeRight){
         console.log(`Invalid move. ${oldTile.typeLeft.toString()} does not connect with ${newTile.typeRight.toString()}`);
         valid = false;
         return false;
      }
      console.log("Has left neighbour");
    }
  });

  if(!hasNeighbour && playedTiles.length > 0){
    console.log(hasNeighbour);
    console.log(`Must be adjacent to another tile. Were playing ${newTile.tileType.toString()} on ${newTile.x.toString()}, ${newTile.y.toString()}`);
    return false;
  }

  console.log("Done checking for valid\r\n");
  console.log('placment is valid? ', valid);
  return valid;
}


Tile.prototype.onClick = function onClick(draggable, pointer){
  this.currentPointer = pointer;
  if(this.dragged)
  {
    // Stop dragging

    var target = { x: Math.floor((this.x + 45) / 90) * 90,
                   y: Math.floor((this.y + 45) / 90) * 90
                   };
    this.game.add.tween(this).to(target, 250).start();

    confirmDrop(target, function(confirmed){
      if (confirmed) {

        if (tile.placementValid (tile, target.x, target.y)){
          tile.placeTile(tile, target.x, target.y)
          console.log("Dropped", tile);
          tile.inputEnabled = false;
          game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
          game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        }

      } 
    }, this);


  }
  else
  {
    // Start dragging
    console.log("Grabbed", this);
    this.fixedToCamera = false;
  }
  this.dragged = !this.dragged;

  function confirmDrop(target, callback) {

    var confirm = tile.game.add.button(target.x + 45, target.y - 45, 'tiles', confirm, this, 23, 23, 23);
    var decline = tile.game.add.button(target.x - 135, target.y - 45, 'tiles', decline, this, 22, 22, 22);

    function confirm() {
      confirm.destroy();
      decline.destroy();
      callback(true);
    }

    function decline() {
      confirm.destroy();
      decline.destroy();
      callback(false);
    }
  }
}

Tile.prototype.update = function update()
{
  if(this.dragged && this.currentPointer)
  {
    // console.log(this.currentPointer.worldX, this.currentPointer.worldY);
    this.x = this.currentPointer.worldX;
    this.y = this.currentPointer.worldY;


  }
}


