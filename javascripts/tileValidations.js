Tile.prototype.numNeighbours = function(type) {
  var count = 0;
  for(var key in this.neighbours){
    if(this.neighbours[key] && this[key] == type){
      count += 1;
    }
  }
  return count;
};

Tile.prototype.placeTile = function placeTile(newTile, x, y) {
    // console.log(`Playing tile ${newTile.tileType} on ${newTile.x}, ${newTile.y}`);

    playedTiles.forEach(function(oldTile) {

      if(oldTile.x == newTile.x && oldTile.y == newTile.y) {
         // console.log("Space occupied");
         return false;
      }

      //Bottom Neighbour
      if(oldTile.x == newTile.x && oldTile.y + 90 == newTile.y) {
        oldTile.neighbours.typeBottom = newTile;
        newTile.neighbours.typeTop = oldTile;
      }

      //Right Neighbour
      if(oldTile.y == newTile.y && oldTile.x + 90 == newTile.x){
        // console.log("Checking for typeRight neighbour");
        oldTile.neighbours.typeRight = newTile;
        newTile.neighbours.typeLeft = oldTile;

      }
      //Top Neighbour
      if(oldTile.x == newTile.x && oldTile.y - 90 == newTile.y) {
        oldTile.neighbours.typeTop = newTile;
        newTile.neighbours.typeBottom = oldTile;

      }
      //Left Neighbour
      if(oldTile.y == newTile.y && oldTile.x - 90 == newTile.x){
        oldTile.neighbours.typeLeft = newTile;
        newTile.neighbours.typeRight = oldTile;

      }
    });

  playedTiles.push(newTile);
  // console.log(playedTiles);
}


Tile.prototype.placementValid = function placementValid(newTile, target){


  // console.log('checking valid')

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

      // console.log("Has typeTop neighbour");
    }
    //Right Neighbour
    if(oldTile.y == target.y && oldTile.x + 90 == target.x){
      hasNeighbour = true;
      // console.log("Checking for typeRight neighbour");

      if(oldTile.typeRight != newTile.typeLeft){
         // console.log(`Invalid move. ${oldTile.typeRight.toString()} does not connect with ${newTile.typeLeft.toString()}`);
         valid = false;
         return false;
      }
      // console.log("Has typeRight neighbour");
    }
    //Top Neighbour
    if(oldTile.x == target.x && oldTile.y - 90 == target.y){
      hasNeighbour = true;

      if(oldTile.typeTop != newTile.typeBottom){
         // console.log(`Invalid move. ${oldTile.typeTop.toString()} does not connect with ${newTile.typeBottom.toString()}`);
         valid = false;
         return false;
      }
      // console.log("Has typeBottom neighbour");
    }

    //Left Neighbour
    if(oldTile.y == target.y && oldTile.x - 90 == target.x){
      hasNeighbour = true;

      if(oldTile.typeLeft != newTile.typeRight){
         // console.log(`Invalid move. ${oldTile.typeLeft.toString()} does not connect with ${newTile.typeRight.toString()}`);
         valid = false;
         return false;
      }
      // console.log("Has typeLeft neighbour");
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


Tile.prototype.getValidMoves = function getValidMoves(){
  var possibleMovesAsStrings = [];

  playedTiles.forEach(function(oldTile){
    // if !(checkForFourNeighbours){
      if (!oldTile.neighbours.typeTop) {
        possibleMovesAsStrings.push(oldTile.x + ',' + (oldTile.y - 90));
      }
      if (!oldTile.neighbours.typeRight) {
        possibleMovesAsStrings.push((oldTile.x + 90) + ',' + oldTile.y);
      }
      if (!oldTile.neighbours.typeBottom) {
        possibleMovesAsStrings.push(oldTile.x + ',' + (oldTile.y + 90));
      }
      if (!oldTile.neighbours.typeLeft) {
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
        // console.log('VALID MOVE: ',currentTarget)
      }
      tile.rotateRight();
    }
  });
  return validMoves;
}
