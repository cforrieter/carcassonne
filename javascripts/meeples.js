Tile.ROADMEEPLECOORDS = {
  A: {p7: [0, 35]},
  T: {p7: [0, 25]},
  S: {p7: [0, 25]},
  P: {p4: [-28, -28]},
  O: {p4: [-28, -28]},
  G: {p4: [0, -5]},
  F: {p4: [0, -5]},
  I: {p1: [0, -35], p3: [-35, 0]},
  H: {p1: [0, -35], p7: [0, 35]},
  E: {p1: [0, -35]},  
  K: {p4: [-30, 0]},
  J: {p4: [30, 0]},
  L: {p3: [-28, 0], p5: [28, 0], p7: [0, 30]},
  U: {p4: [0, 0]},
  V: {p4: [-2, 0]},
  W: {p3: [-25, -2], p5: [25, -2], p7: [0, 20]},
  X: {p1: [0, -22], p3: [-22, 0], p5: [22, 0], p7: [0, 22]},
  D: {p4: [10, -3]}
};

Tile.CITYMEEPLECOORDS = {
  C: {p4: [0, 0]},
  R: {p4: [0, -25]},
  Q: {p4: [0, -25]},
  T: {p4: [0, -25]},
  S: {p4: [0, -25]},
  N: {p4: [-30, -30]},
  M: {p4: [-30, -30]},
  P: {p4: [5, 30]},
  O: {p4: [-28, -28]},
  G: {p4: [0, -5]},
  F: {p4: [0, -5]},
  I: {p1: [0, -35], p3: [-35, 0]},
  H: {p1: [0, -35], p7: [0, 35]},
  E: {p1: [0, -35]}, 
  K: {p1: [0, -35]},
  J: {p1: [0, -35]},
  L: {p1: [0, -35]},
  D: {p1: [0, -35]}
};

Tile.FARMERMEEPLECOORDS = {
  B: {p0: [-30, -30]},
  A: {p0: [-30, -30]},
  R: {p6: [0, 35]},
  Q: {p6: [0, 35]},
  T: {p6: [-30, 35], p8: [30, 35]},
  S: {p6: [-30, 35], p8: [30, 35]},
  N: {p4: [15, 15]},
  M: {p4: [15, 15]},
  P: {p4: [5, 0], p8: [35, 35]},
  O: {p4: [5, 0], p8: [35, 35]},
  G: {p0: [0, -38], p6: [0, 35]},
  F: {p0: [0, -38], p6: [0, 35]},
  I: {p4: [5, 5]},
  H: {p4: [0, 0]},
  E: {p4: [0, 10]}, 
  K: {p6: [-32, 30], p8: [20, 0]},
  J: {p6: [-25, 0], p8: [30, 30]},
  L: {p0: [0, -7], p6: [-30, 32], p8: [30, 32]},
  U: {p0: [-28, -28], p2: [28, 28]},
  V: {p0: [28, -28], p6: [-28, 28]},
  W: {p0: [0, -30], p6: [-30, 30], p8: [30, 30]},
  X: {p0: [-30, -30], p2: [30, -30], p6: [-30, 30], p8: [30, 30]},
  D: {p0: [-35, -18], p6: [0, 35]}
};

Tile.MONASTERYMEEPLECOORDS = {
  B: {p4: [0,0]},
  A: {p4: [0,0]}
}

Tile.prototype.showMeepleSpots = function showMeepleSpots(tile) {
  // debugger;
  var coords = Tile.MEEPLECOORDS[tile.tileType]
  var meepleButtons = game.add.group();
  for (var key in coords) {
    var position = {
      positionKey: key,
      ghostCoords: tileRotationCoordTransform(tile, coords[key][0], coords[key][1]),
      farmer: coords[key][2]
    };
    // console.log('xCoord is: ', xCoord, 'yCoord is: ', yCoord, 'farmer is: ', farmer);
    // console.log(position['ghostCoords'])

    var button = tile.game.add.button(position['ghostCoords'][0], position['ghostCoords'][1], 'meepleGhost', addMeeple, position)
    button.anchor.setTo(0.5);
    // debugger;
    meepleButtons.add(button, false);

  }

  var confirm = tile.game.add.button(tile.x + 60, tile.y - 30, 'check', confirm, this, 23, 23, 23);
  confirm.scale.setTo(0.3);

  function confirm() {
    confirm.destroy();
    meepleButtons.destroy();
  }

  function tileRotationCoordTransform (tile, localX, localY) {
    var x = localX * Math.cos(Phaser.Math.degToRad(tile.angle)) - localY * Math.sin(Phaser.Math.degToRad(tile.angle)) + tile.x;
    var y = localX * Math.sin(Phaser.Math.degToRad(tile.angle)) + localY * Math.cos(Phaser.Math.degToRad(tile.angle)) + tile.y;
    return [x, y];
  }

  function addMeeple() {
    meepleButtons.destroy();
    if (this.farmer) {
      var shadow = game.add.sprite(this.ghostCoords[0], this.ghostCoords[1], 'meepleFarmer')
      shadow.anchor.setTo(0.5);
      shadow.x = shadow.x + 3
      shadow.y = shadow.y + 3
      shadow.tint = 0x000000;
      shadow.alpha = 0.6;
      var meeple = game.add.sprite(this.ghostCoords[0], this.ghostCoords[1], 'meepleFarmer')
      meeple.anchor.setTo(0.5);
    } else {
       var shadow = game.add.sprite(this.ghostCoords[0], this.ghostCoords[1], 'blueMeeple')
      shadow.anchor.setTo(0.5);
      shadow.x = shadow.x + 3
      shadow.y = shadow.y + 3
      shadow.tint = 0x000000;
      shadow.alpha = 0.6;
      var meeple = game.add.sprite(this.ghostCoords[0], this.ghostCoords[1], 'blueMeeple')
      meeple.anchor.setTo(0.5);
    }
    // console.log('You clicked on ' + this.ghostCoords)
  }

}