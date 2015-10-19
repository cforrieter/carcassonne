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
    console.log(position['ghostCoords'])
    var button = tile.game.add.button(position['ghostCoords'][0], position['ghostCoords'][1], 'meepleGhost', addMeeple, position)
    button.anchor.setTo(0.5);
    // debugger;
    meepleButtons.add(button, false);

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
    console.log('You clicked on ' + this.ghostCoords)
  }

}