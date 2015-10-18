// const util = require('util');
// const inspect = (o, d) => console.log(util.inspect(o, { colors: true, depth: d || 1 }));

function Tile(type) {
  this.type = type;
  this.x = 0;
  this.y = 0;
  this.left = null;
  this.right = null;
  this.top = null;
  this.bottom = null;
  this.neighbours = {
    left: null,
    right: null,
    top: null,
    bottom: null
  };
  this.occupant  = null;
  var kind = Tile.KINDS[type];
  if(!kind){
    throw new Error("Invalid tile type: %s", type);
  }

  for(var k in kind){
    this[k] = kind[k];
  }
}

Tile.prototype.rotate = function(){
  switch(this.type){
    case 'B':
    case 'C':
    case 'X':
      return;
  }

  var x = this.bottom, y = this.left, z = this.top, w = this.right;
  this.left = x;
  this.top = y;
  this.right = z;
  this.bottom = w;
};

Tile.prototype.hasNeighbours = function() { return !!(this.neighbours.left || this.neighbours.right || this.neighbours.top || this.neighbours.bottom); };

Tile.TYPES = {
  ROAD: Symbol("ROAD"),
  CITY: Symbol("CITY"),
  TERMINATOR: Symbol("TERMINATOR"),
  CLOISTER: Symbol("CLOISTER"),
  FIELD: Symbol("FIELD")
};

Tile.KINDS = {
  L: {
    top: Tile.TYPES.CITY,
    bottom: Tile.TYPES.ROAD,
    left: Tile.TYPES.FIELD,
    right: Tile.TYPES.ROAD
  },
  J: {
    top: Tile.TYPES.ROAD,
    bottom: Tile.TYPES.ROAD,
    left: Tile.TYPES.ROAD,
    right: Tile.TYPES.CITY
  }
};

var tiles = [];
var playableTiles = "LJLJLJ".split('').map(c => new Tile(c))

function makeGrid(){
  const grid = [];
  tiles.forEach(tile => {
    if(!grid[tile.x])
    {
      grid[tile.x] = [];
    }
    if(!grid[tile.x][tile.y])
    {
      grid[tile.x][tile.y] = []
    }
    grid[tile.x][tile.y] = tile;
  });
  return grid;
}

function playTile(x, y){
  if(playableTiles.length === 0)
  {
    throw new Error("Out of moves");
  }
  var newTile = playableTiles.pop();
  newTile.x = x;
  newTile.y = y;

  console.log(`Playing tile ${newTile.type} on ${newTile.x}, ${newTile.y}`);

  tiles.forEach(oldTile =>
  {
    if(oldTile.x == newTile.x && oldTile.y == newTile.y)
    {
      throw new Error("Space occupied");
    }
    console.log(oldTile.x, oldTile.y, newTile.x, newTile.y);
    //Old tile is the Top Neighbour
    if(oldTile.x == newTile.x && oldTile.y + 1 == newTile.y){
      oldTile.neighbours.bottom = newTile;
      newTile.neighbours.top = oldTile;

      if(oldTile.bottom != newTile.top){
        throw new Error(`Invalid move. ${oldTile.bottom.toString()} does not connect with ${newTile.top.toString()}`);
      }

      console.log("Has top neighbour");
    }
    //Bottom Neighbour
    if(oldTile.x == newTile.x && oldTile.y - 1 == newTile.y){
      oldTile.neighbours.top = newTile;
      newTile.neighbours.bottom = oldTile;

      if(oldTile.top != newTile.bottom){
        throw new Error(`Invalid move. ${oldTile.top} does not connect with ${newTile.bottom}`);
      }
      console.log("Has bottom neighbour");
    }

    //Left Neighbour
    if(oldTile.y == newTile.y && oldTile.x + 1 == newTile.x){
      oldTile.neighbours.right = newTile;
      newTile.neighbours.left = oldTile;

      if(oldTile.right != newTile.left){
        throw new Error(`Invalid move. ${oldTile.right} does not connect with ${newTile.left}`);
      }
      console.log("Has left neighbour");
    }
    //Right Neighbour
    if(oldTile.y == newTile.y && oldTile.x - 1 == newTile.x){
      console.log("Checking for right neighbour");
      oldTile.neighbours.left = newTile;
      newTile.neighbours.bottom = oldTile;

      if(oldTile.left != newTile.right){
        throw new Error(`Invalid move. ${oldTile.left} does not connect with ${newTile.right}`);
      }
      console.log("Has right neighbour");
    }

  });

  if(!newTile.hasNeighbours() && tiles.length > 0){
    inspect(newTile);
    throw new Error(`Must be adjacent to another tile. Were playing ${newTile.type} on ${newTile.x}, ${newTile.y}`);
  }
  console.log("Done\r\n");
  tiles.push(newTile);
  return newTile;
}

var tile1 = playTile(1,0);
var tile2 = playTile(1,1);
var tile3 = playTile(0,1);

console.log(tile1.neighbours.bottom.neighbours.left === tile3);

// inspect(tile1);
// tile1.rotate();
// inspect(tile1);



inspect(makeGrid());
