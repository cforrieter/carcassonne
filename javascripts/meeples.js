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
  B: {p4: [-30, -30]},
  A: {p4: [-30, -30]},
  C: {},
  R: {p4: [0, 35]},
  Q: {p4: [0, 35]},
  T: {p3: [-30, 35], p5: [30, 35]},
  S: {p3: [-30, 35], p5: [30, 35]},
  N: {p4: [15, 15]},
  M: {p4: [15, 15]},
  P: {p4: [5, 0], p5: [35, 35]},
  O: {p4: [5, 0], p5: [35, 35]},
  G: {p1: [0, -38], p7: [0, 35]},
  F: {p1: [0, -38], p7: [0, 35]},
  I: {p4: [5, 5]},
  H: {p4: [0, 0]},
  E: {p4: [0, 10]},
  K: {p3: [-32, 30], p4: [20, 0]},
  J: {p4: [-25, 0], p5: [30, 30]},
  L: {p4: [0, -7], p3: [-30, 32], p5: [30, 32]},
  U: {p3: [-28, -28], p5: [28, 28]},
  V: {p4: [28, -28], p3: [-28, 28]},
  W: {p4: [0, -30], p3: [-30, 30], p5: [30, 30]},
  X: {p1: [-30, -30], p5: [30, -30], p3: [-30, 30], p7: [30, 30]},
  D: {p1: [-35, -18], p7: [0, 35]}
};

Tile.MONASTERYMEEPLECOORDS = {
  B: {p4: [0,0]},
  A: {p4: [0,0]}
};

var allMeeples;

var newTile = false;
var meepleButtons;
var confirm;

function findRoadById(id){
  for (var i = 0; i < roads.length; i++){
    var road = roads[i];
    if(road.id === id){
      return road;
    }
  }
}

function findCityById(id){
 for (var i = 0; i < cities.length; i++){
    var city = cities[i];
    if(city.id === id){
      return city;
    }
  }
}

function findMonasteryById(id){
  for (var i = 0; i < monasteries.length; i++){
    var monastery = monasteries[i];
    if(monastery.id === id){
      return monastery;
    }
  }
}

function findFarmById(id){
  for (var i = 0; i < farms.length; i++){
    var farm = farms[i];
    if(farm.id === id){
      return farm;
    }
  }
}


Tile.prototype.showMeepleSpots = function showMeepleSpots(tile, roadEdges, cityEdges, farmerEdges) {
  newTile = true;

  var road;
  roadEdges.forEach(function(roadEdge){
    road = findRoadById(roadEdge.scoringID)
    roadEdge.scoringObject = road;
  });
  var city;
  console.log("City edges: ", cityEdges)
  cityEdges.forEach(function(cityEdge){
    city = findCityById(cityEdge.scoringID)
    cityEdge.scoringObject = city;
  });
  var farm;
  farmerEdges.forEach(function(farmerEdge){
    farm = findFarmById(farmerEdge.scoringID)
    farmerEdge.scoringObject = farm;
  });

  console.log('Road edges: ', roadEdges);
  console.log('City edges: ', cityEdges);

 confirm = tile.game.add.button(tile.x + 60, tile.y - 30, 'check', confirmFunc, this, 23, 23, 23);
 confirm.scale.setTo(0.3);


if(getCurrentPlayer().numMeeples > 0 && !(roadEdges.length === 0 && cityEdges.length === 0 && !tile.centerMonastery && farmerEdges.length === 0)){

  var roadCoords = Tile.ROADMEEPLECOORDS[tile.tileType];
  var cityCoords = Tile.CITYMEEPLECOORDS[tile.tileType];
  var monasteryCoords = Tile.MONASTERYMEEPLECOORDS[tile.tileType];
  var farmerCoords = Tile.FARMERMEEPLECOORDS[tile.tileType];
  // console.log('Road coords: ', roadCoords);
  // console.log('City coords: ', cityCoords);


  if(monasteryCoords){
    var monastery = new Monastery();
    monastery.tile = tile;
    // monastery.meeples = getCurrentPlayer();
    monasteries.push(monastery);
  }

   meepleButtons = game.add.group();

  checkPositions(roadCoords, roadEdges, false);
  checkPositions(cityCoords, cityEdges, false);
  checkPositions(monasteryCoords, [{pos: 'typeCenter', scoringObject: monastery}], false);
  checkPositions(farmerCoords, farmerEdges, true);

  } else {
    confirmFunc();
  }

  function checkPositions(coords, meepleEdges, isFarmer){
    var positions = allowablePositions(meepleEdges);
    positions.forEach(function(position){
      for (var key in coords){
        if (position.pos === key){
          var meeplePosition = {
            positionKey: key,
            ghostCoords: tileRotationCoordTransform(tile, coords[key][0], coords[key][1]),
            farmer: isFarmer,
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
    endTurn();
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
};

function addMeeple(meepObject) {
  if (meepObject instanceof Phaser.Button){
    meepObject = this;
  }
  if(newTile){
    meepleButtons.destroy();
    confirm.destroy();
  }
    // allMeeples.add(shadow);
    // allMeeples.add(meeple);


    // console.log('You clicked on ' + this.positionKey + ',' + this.scoringObjectType
  if (meepObject.farmer) {
    var shadow = game.add.sprite(meepObject.ghostCoords[0], meepObject.ghostCoords[1], 'meepleFarmer')
    shadow.anchor.setTo(0.5);
    shadow.x = shadow.x + 3
    shadow.y = shadow.y + 3
    shadow.tint = 0x000000;
    shadow.alpha = 0.6;
    var meeple = game.add.sprite(meepObject.ghostCoords[0], meepObject.ghostCoords[1], 'meepleFarmer')
    meeple.anchor.setTo(0.5);
    meeple.tint = "0x" + getCurrentPlayer().color;
    meeple.playerName = getCurrentPlayer().name;
  } else {
    var shadow = game.add.sprite(meepObject.ghostCoords[0], meepObject.ghostCoords[1], 'meeple')
    shadow.anchor.setTo(0.5);
    shadow.x += 3;
    shadow.y += 3;
    shadow.tint = 0x000000;
    shadow.alpha = 0.6;
    var meeple = game.add.sprite(meepObject.ghostCoords[0], meepObject.ghostCoords[1], 'meeple')
    meeple.anchor.setTo(0.5);
    meeple.tint = "0x" + getCurrentPlayer().color;
    meeple.playerName = getCurrentPlayer().name;
  }

  var currentPlayer = getCurrentPlayer();
  console.log(meepObject);
  meepObject.scoringObject.meeples.push(currentPlayer);
  currentPlayer.numMeeples -= 1;
  // TODO: remove a meeple from the player when played and score points if points scored
  // globalPlayers.player1.numMeeples -= 1;
  // globalPlayers.player1.score += 50;
  // ============================

  // console.log("Scoring object: ",this.scoringObject)
  meepObject.scoringObject.meepleGroup.add(shadow, false);
  meepObject.scoringObject.meepleGroup.add(meeple, false);
  // console.log("SCORING OBJECT'S MEEPLE GROUP: ", this.scoringObject.meepleGroup)
  // var currentScoringObjectMeepGroup = this.scoringObject.meepleGroup
  game.add.existing(meepObject.scoringObject.meepleGroup);
  game.world.bringToTop(meepObject.scoringObject.meepleGroup);

  // console.log('You clicked on ' + this.positionKey + ',' + this.scoringObjectType)
  endTurn(meepObject)
}

function endTurn(meepObject){
  checkFinishedRoads();
  checkFinishedCities();
  checkMonasteries();
  yScoreOffset = 30;
  if (playedTiles.length === 72){
    io.emit('gameOver', { gameID: gameID });
    // endGame();
  } else {
    if(newTile){
      newTile = false;
      endTurnServer(meepObject);
    }
  }
}

function scoreMeepAnimation(meepleGroup, scoringPlayers){
  game.world.bringToTop(meepleGroup);
  // embiggen and fade out meeple
  meepleGroup.children.forEach(function(meeple){
    scoringPlayers.forEach(function(player){
      if (player === meeple.playerName){
        var tween = game.add.tween(meeple.scale).to({x: 2, y: 2}, 1000, "Linear", true);
        game.add.tween(meeple).to( { alpha: 0 }, 1000, "Linear", true);
      } else {
        var tween = game.add.tween(meeple).to( { alpha: 0 }, 1000, "Linear", true);
      }
      tween.onComplete.add(function(){
        meepleGroup.destroy();
      });
    })
  })

}

var yScoreOffset = 30;

function scoreTilesAnimation(scoringGroup, pointsScored, scoringPlayers){
  // draw points scoring over last played tile
  var alreadyDisplayedPlayers = [];
  var x;
  var y;
  var playerOb;

  for (var m = 1; m < scoringGroup.meepleGroup.children.length; m += 2){
    scoringPlayers.forEach(function(player){
      playerOb = getPlayer(player);
      playerOb.score += pointsScored;

      if(gameOver){
        x = scoringGroup.meepleGroup.children[m].x - 15;
        y = scoringGroup.meepleGroup.children[m].y - 70;
      }else{
        x = playedTiles[playedTiles.length - 1].x - 25;
        y = playedTiles[playedTiles.length - 1].y - yScoreOffset;
      }
      if (player === scoringGroup.meepleGroup.children[m].playerName && alreadyDisplayedPlayers.indexOf(player) === -1){
        alreadyDisplayedPlayers.push(player);
        var points = game.add.text(
        x,
        y,
        // scoringGroup.meepleGroup.children[m].x - 15,
        // scoringGroup.meepleGroup.children[m].y - 70,
        // // playedTiles[playedTiles.length - 1].x - 25,
        // // playedTiles[playedTiles.length - 1].y - yScoreOffset,
        "+" + pointsScored, {
        font: "42px Lindsay",
        fill: "#" + scoringGroup.meeples[0].color
        }
      );
      yScoreOffset += 35;
      game.add.tween(points).to( {alpha: 0}, 1400, "Linear", true);
      }
    })
  }

  // slightly expand tile group scoring
  scoringGroup.tiles.forEach(function(t){
    var tween = game.add.tween(t.tile.scale).to({x: 1.05, y: 1.05}, 200, "Linear", true);
    tween.onComplete.add(function(){
      var tweenB = game.add.tween(t.tile.scale).to({x: 1, y: 1}, 200, "Linear", true)
      tweenB.onComplete.add(function(){
        scoreMeepAnimation(scoringGroup.meepleGroup, scoringPlayers);
      })
    });
  })
}
