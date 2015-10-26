var monasteries = [];
var monasteryNeighbours = 0;

function checkMonasteries(){
  monasteries.forEach(function(monastery){
    if(monastery.tile.neighbours.typeTop){
      monasteryNeighbours += 1;
      if(monastery.tile.neighbours.typeTop.neighbours.typeRight){
        monasteryNeighbours += 1;
      }
    };
    if(monastery.tile.neighbours.typeRight){
      monasteryNeighbours += 1;
      if(monastery.tile.neighbours.typeRight.neighbours.typeBottom){
        monasteryNeighbours += 1;
      }
    };
    if(monastery.tile.neighbours.typeBottom){
      monasteryNeighbours += 1;
      if(monastery.tile.neighbours.typeBottom.neighbours.typeLeft){
        monasteryNeighbours += 1;
      }
    };
    if(monastery.tile.neighbours.typeLeft){
      monasteryNeighbours += 1;
      if(monastery.tile.neighbours.typeLeft.neighbours.typeTop){
        monasteryNeighbours += 1;
      }
    };
    if(monasteryNeighbours === 8){
      scoreAndRemoveMonastery(monastery);
    };
    monasteryNeighbours = 0;
  });
}

function scoreMonastery(){
  console.log("Monastery completed!");
}

function scoreAndRemoveMonastery(monasteryToRemove){
  monasteries.forEach(function(arrayMonastery, index){
    if (arrayMonastery.tile.y === monasteryToRemove.tile.y && arrayMonastery.tile.x === monasteryToRemove.tile.x){
      scoreMeepAnimation(monasteries[index], 9);
      // monasteries[index].meepleGroup.destroy();
      monasteries[index].meeples[0].score += 9; 
      monasteries[index].meeples[0].numMeeples += 1;
      monasteries.splice(index, 1);
    }
  })
}

function endGameMonasteryCount(){
  var neighbours = 1; //starts at one, because score includes monastery tile
  monasteries.forEach(function(monastery, index){
    if (monastery.tile.neighbours.typeTop){
      neighbours += 1;
    }
    if (monastery.tile.neighbours.typeRight){
      neighbours += 1;
    } 
    if (monastery.tile.neighbours.typeBottom){
      neighbours += 1;
    } 
    if (monastery.tile.neighbours.typeLeft){
      neighbours += 1;
    }
    playedTiles.forEach(function(playedTile){
      if (monastery.tile.x + 90 === playedTile.x && monastery.tile.y + 90 === playedTile.y){
        neighbours += 1;
      }
      if (monastery.tile.x + 90 === playedTile.x && monastery.tile.y - 90 === playedTile.y){
        neighbours += 1;
      }
      if (monastery.tile.x - 90 === playedTile.x && monastery.tile.y + 90 === playedTile.y){
        neighbours += 1;
      }
      if (monastery.tile.x - 90 === playedTile.x && monastery.tile.y - 90 === playedTile.y){
        neighbours += 1;
      }
    })
    monasteries[index].meeples[0].score += neighbours; 
  })
}

function Monastery(){
  this.tile;
  this.meeples = [];
  this.meepleGroup = game.add.group();
  game.add.existing(this.meepleGroup);
}
