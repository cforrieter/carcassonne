Tile.POSITION = {
  '0': {typeTop: 'p1', typeRight: 'p5', typeBottom: 'p7', typeLeft: 'p3', typeCenter: 'p4' },
  '90': {typeTop: 'p3', typeRight: 'p1', typeBottom: 'p5', typeLeft: 'p7', typeCenter: 'p4' },
  '-180': {typeTop: 'p7', typeRight: 'p3', typeBottom: 'p1', typeLeft: 'p5', typeCenter: 'p4' },
  '-90': {typeTop: 'p5', typeRight: 'p7', typeBottom: 'p3', typeLeft: 'p1', typeCenter: 'p4' }
}

Tile.ROADMEEPLECOORDS = {
  A: {p7: [0, 35]},
  T: {p7: [0, 25]},
  S: {p7: [0, 25]},
  P: {p4: [5, 30]},
  O: {p4: [5, 30]},
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
  P: {p4: [-28, -28]},
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
};


Tile.prototype.showMeepleSpots = function showMeepleSpots(tile, roadEdges, cityEdges) {

var confirm = tile.game.add.button(tile.x + 60, tile.y - 30, 'check', confirmFunc, this, 23, 23, 23);
confirm.scale.setTo(0.3);


if(getCurrentPlayer().numMeeples !== 0 && !(roadEdges.length === 0 && cityEdges.length === 0 && !tile.centerMonastery)){

  var roadCoords = Tile.ROADMEEPLECOORDS[tile.tileType];
  var cityCoords = Tile.CITYMEEPLECOORDS[tile.tileType];
  var monasteryCoords = Tile.MONASTERYMEEPLECOORDS[tile.tileType];
  // console.log('Road coords: ', roadCoords);
  // console.log('City coords: ', cityCoords);


  if(monasteryCoords){
    var monastery = new Monastery();
    monastery.tile = tile;
    // monastery.meeples = getCurrentPlayer();
    monasteries.push(monastery);
  }

    // coords = mergeObjects(roadCoords, cityCoords);
    // console.log('Merged coords: ', coords);


  var meepleButtons = game.add.group();

  checkPositions(roadCoords, roadEdges);
  checkPositions(cityCoords, cityEdges);
  checkPositions(monasteryCoords, [{pos: 'typeCenter', scoringObject: monastery}]);

    checkPositions(roadCoords, roadEdges);
    checkPositions(cityCoords, cityEdges);
  }else{
    confirmFunc();
  }
  function checkPositions(coords, meepleEdges){
    var positions = allowablePositions(meepleEdges);
    positions.forEach(function(position){
      for (var key in coords){
        if (position.pos === key){
          var meeplePosition = {
            positionKey: key,
            ghostCoords: tileRotationCoordTransform(tile, coords[key][0], coords[key][1]),
            // farmer: coords[key][2],
            scoringObject: position.scoringObject
          };
        // console.log('xCoord is: ', xCoord, 'yCoord is: ', yCoord, 'farmer is: ', farmer);
        // console.log(position['ghostCoords'])

        var button = tile.game.add.button(meeplePosition['ghostCoords'][0], meeplePosition['ghostCoords'][1], 'meepleGhost', addMeeple, meeplePosition);
        button.anchor.setTo(0.5);
        meepleButtons.add(button, false);
        }
      }
    })
  }

  // console.log('MEEPLE BUTTONS',meepleButtons)

  // console.log('allowable spots ', positions)





  function confirmFunc() {
    confirm.destroy();
    if(meepleButtons){
        meepleButtons.destroy();
    }
    window.createTile();
    checkFinishedRoads();
    checkFinishedCities();
    checkMonasteries();
  }

  function allowablePositions (meepleEdges) {
    var positions = [];
    for ( var i = 0; i < meepleEdges.length; i++ ) {
      positions.push(Tile.POSITION[tile.angle.toString()][meepleEdges[i].pos])
      positions.push({pos: Tile.POSITION[tile.angle.toString()][meepleEdges[i].pos], scoringObject: meepleEdges[i].scoringObject})
      // console.log('=======MEEPLE POS IN ALLOWABLE POSTIONS: ', meepleEdges[i].pos, meepleEdges[i].road)
      // console.log(positions)
    }
    return positions;
    // console.log('allowable positions: ', positions);
  }

  function tileRotationCoordTransform (tile, localX, localY) {
    var x = localX * Math.cos(Phaser.Math.degToRad(tile.angle)) - localY * Math.sin(Phaser.Math.degToRad(tile.angle)) + tile.x;
    var y = localX * Math.sin(Phaser.Math.degToRad(tile.angle)) + localY * Math.cos(Phaser.Math.degToRad(tile.angle)) + tile.y;
    return [x, y];
  }

  function addMeeple() {
    meepleButtons.destroy();
    confirm.destroy();
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
      var shadow = game.add.sprite(this.ghostCoords[0], this.ghostCoords[1], 'meeple')
      shadow.anchor.setTo(0.5);
      shadow.x += 3;
      shadow.y += 3;
      shadow.tint = 0x000000;
      shadow.alpha = 0.6;
      var meeple = game.add.sprite(this.ghostCoords[0], this.ghostCoords[1], 'meeple')
      meeple.anchor.setTo(0.5);
      meeple.tint = "0x" + getCurrentPlayer().color
    }

    var currentPlayer = getCurrentPlayer();
    this.scoringObject.meeples.push(currentPlayer);
    currentPlayer.numMeeples -= 1;
    // TODO: remove a meeple from the player when played and score points if points scored
    // globalPlayers.player1.numMeeples -= 1;
    // globalPlayers.player1.score += 50;
    // ============================

    // console.log("Scoring object: ",this.scoringObject)
    this.scoringObject.meepleGroup.add(shadow, false);
    this.scoringObject.meepleGroup.add(meeple, false);
    // console.log("SCORING OBJECT'S MEEPLE GROUP: ", this.scoringObject.meepleGroup)
    // var currentScoringObjectMeepGroup = this.scoringObject.meepleGroup
    game.add.existing(this.scoringObject.meepleGroup);
    game.world.bringToTop(this.scoringObject.meepleGroup);

    // console.log('You clicked on ' + this.positionKey + ',' + this.scoringObjectType)
    checkFinishedRoads();
    checkFinishedCities();

    if (gameTiles.length === 0){ 
      endGame();
    } else {
      window.createTile();
    }
  }



};
