Tile.MEEPLECOORDS = {
 B: {p4: [0, 0, false], p0: [-30, -30, true]},
 A: {p4: [0, 0, false], p0: [-30, -30, true], p7: [0, 35, false]},
 C: {p4: [0, 0, false]},
 R: {p0: [0, -25, false], p6: [0, 35, true]},
 Q: {p0: [0, -25, false], p6: [0, 35, true]},
 T: {p1: [0, -25, false], p6: [-30, 35, true], p7: [0, 25, false], p8: [30, 35, true]},
 S: {p0: [0, -25, false], p6: [-30, 35, true], p7: [0, 25, false], p8: [30, 35, true]},
 N: {p1: [-30, -30, false], p4: [15, 15, true]},
 M: {p1: [-30, -30, false], p4: [15, 15, true]},
 P: {p1: [-28, -28, false], p4: [5, 0, true], p5: [5, 30, false], p8: [35, 35, true]},
 O: {p1: [-28, -28, false], p4: [5, 0, true], p5: [5, 30, false], p8: [35, 35, true]},
 G: {p0: [0, -38, true], p3: [0, -5, false], p6: [0, 35, true]},
 F: {p0: [0, -38, true], p3: [0, -5, false], p6: [0, 35, true]},
 I: {p1: [0, -35, false], p3: [-35, 0, false], p4: [5, 5, true]},
 H: {p1: [0, -35, false], p4: [0, 0, true],  p7: [0, 35, false]},
 E: {p1: [0, -35, false], p4: [0, 10, true]}, 
 K: {p1: [0, -35, false], p3: [-30, 0, false], p6: [-32, 30, true], p8: [20, 0, true]},
 J: {p1: [0, -35, false], p5: [30, 0, false], p6: [-25, 0, true], p8: [30, 30, true]},
 L: {p0: [0, -7, true], p1: [0, -35, false], p3: [-28, 0, false], p5: [28, 0, false], p6: [-30, 32, true], p7: [0, 30, false], p8: [30, 32, true]},
 U: {p0: [-28, -28, true], p2: [28, 28, true], p4: [0, 0, false]},
 V: {p0: [28, -28, true], p4: [-2, 0, false], p6: [-28, 28, true]},
 W: {p0: [0, -30, true], p3: [-25, -2, false], p5: [25, -2, false], p6: [-30, 30, true], p7: [0, 20, false], p8: [30, 30, true]},
 X: {p0: [-30, -30, true], p1: [0, -22, false], p2: [30, -30, true], p3: [-22, 0, false], p5: [22, 0, false], p6: [-30, 30, true], p7: [0, 22, false], p8: [30, 30, true]},
 D: {p0: [-35, -18, true], p1: [0, -35, false], p4: [10, -3, false], p6: [0, 35, true]}
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
    // console.log(position['ghostCoords'])
    var button = tile.game.add.button(position['ghostCoords'][0], position['ghostCoords'][1], 'meepleGhost', addMeeple, position).anchor.setTo(0.5);

    // meepleButtons.add(button, false);
  }

  function tileRotationCoordTransform (tile, localX, localY) {
    var x = localX * Math.cos(Phaser.Math.degToRad(tile.angle)) - localY * Math.sin(Phaser.Math.degToRad(tile.angle)) + tile.x;
    var y = localX * Math.sin(Phaser.Math.degToRad(tile.angle)) + localY * Math.cos(Phaser.Math.degToRad(tile.angle)) + tile.y;
    return [x, y];
  }

  function addMeeple() {

    console.log('You clicked on ' + this.ghostCoords)
  }

}