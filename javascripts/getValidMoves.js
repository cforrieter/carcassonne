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


