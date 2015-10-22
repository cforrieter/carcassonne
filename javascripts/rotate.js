rotate = {
  right: function(){
    switch(tile.tileType){
      case 'B':
      case 'C':
      case 'X':
        return;
    }

    tile.angle += 90;

    var x = tile.typeBottom, y = tile.typeLeft, z = tile.typeTop, w = tile.typeRight;
    tile.typeLeft = x;
    tile.typeTop = y;
    tile.typeRight = z;
    tile.typeBottom = w;

    if (tile.dropped) {
      if (!(tile.placementValid(tile, tile))) {
        rotate.right();
      }      
    }
  },

  left: function(){
    switch(tile.tileType){
      case 'B':
      case 'C':
      case 'X':
        return;
    }

    tile.angle -= 90;

    var x = tile.typeBottom, y = tile.typeLeft, z = tile.typeTop, w = tile.typeRight;
    tile.typeLeft = z;
    tile.typeTop = w;
    tile.typeRight = x;
    tile.typeBottom = y;

    if (tile.dropped) {
      if (!(tile.placementValid(tile, tile))) {
        rotate.left();
      }
    }
  }
};

Tile.prototype.rotateRight = rotate.right;

Tile.prototype.rotateLeft = rotate.left;

Tile.prototype.rightKeyDown = function rightKeyDown() {
  tile.rotateRight();
}

Tile.prototype.leftKeyDown = function leftKeyDown() {
  tile.rotateLeft();
}

