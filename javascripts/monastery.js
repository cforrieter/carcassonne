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
  monasteries.forEach(function(mon, index){
    if (mon.tile.y === monasteryToRemove.tile.y && mon.tile.x === monasteryToRemove.tile.x){
      mon.tiles.push(
        { tile: mon.tile }, 
        { tile: mon.tile.neighbours.typeTop }, 
        { tile: mon.tile.neighbours.typeTop.neighbours.typeRight },
        { tile: mon.tile.neighbours.typeRight }, 
        { tile: mon.tile.neighbours.typeRight.neighbours.typeBottom },
        { tile: mon.tile.neighbours.typeBottom }, 
        { tile: mon.tile.neighbours.typeBottom.neighbours.typeLeft },
        { tile: mon.tile.neighbours.typeLeft }, 
        { tile: mon.tile.neighbours.typeLeft.neighbours.typeTop }
      ); 
      scoreTilesAnimation(monasteries[index], 9, [monasteries[index].meeples[0].name]);
      // monasteries[index].meepleGroup.destroy();
      monasteries[index].meeples[0].score += 9; 
      monasteries[index].meeples[0].numMeeples += 1;
      monasteries.splice(index, 1);
    }
  })
}

function endGameMonasteryCount(){
  monasteries.forEach(function(monastery, index){
    var neighbours = 1; //starts at one, because score includes monastery tile
    if(monastery.meeples.length > 0) {
      monastery.tiles.push({ tile: monastery.tile });
      if (monastery.tile.neighbours.typeTop){
        monastery.tiles.push({ tile: monastery.tile.neighbours.typeTop });
        neighbours += 1;
      }
      if (monastery.tile.neighbours.typeRight){
        monastery.tiles.push({ tile: monastery.tile.neighbours.typeRight });
        neighbours += 1;
      } 
      if (monastery.tile.neighbours.typeBottom){
        monastery.tiles.push({ tile: monastery.tile.neighbours.typeBottom });
        neighbours += 1;
      } 
      if (monastery.tile.neighbours.typeLeft){
        monastery.tiles.push({ tile: monastery.tile.neighbours.typeLeft })
        neighbours += 1;
      }
      playedTiles.forEach(function(playedTile){
        if (monastery.tile.x + 90 === playedTile.x && monastery.tile.y + 90 === playedTile.y){
          monastery.tiles.push({ tile: playedTile });
          neighbours += 1;
        } else if (monastery.tile.x + 90 === playedTile.x && monastery.tile.y - 90 === playedTile.y) {
          monastery.tiles.push({ tile: playedTile });
          neighbours += 1;
        } else if (monastery.tile.x - 90 === playedTile.x && monastery.tile.y + 90 === playedTile.y) {
          monastery.tiles.push({ tile: playedTile });
          neighbours += 1;
        } else if (monastery.tile.x - 90 === playedTile.x && monastery.tile.y - 90 === playedTile.y) {
          monastery.tiles.push({ tile: playedTile });
          neighbours += 1;
        }
      })
      scoreTilesAnimation(monasteries[index], neighbours, [monasteries[index].meeples[0].name]);
      monastery.meeples[0].score += neighbours; 
    }
  })
}

function Monastery(){
  this.tile;
  this.tiles = [];
  this.meeples = [];
  this.meepleGroup = game.add.group();
  game.add.existing(this.meepleGroup);
}
