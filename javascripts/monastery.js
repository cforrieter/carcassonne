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
      scoreMonastery();
      removeMonastery(monastery);
    };
    monasteryNeighbours = 0;
  });
}

function scoreMonastery(){
  console.log("Monastery completed!");
}

function removeMonastery(monasteryToRemove){
  monasteries.forEach(function(arrayMonastery, index){
    if (arrayMonastery.tile.y === monasteryToRemove.tile.y && arrayMonastery.tile.x === monasteryToRemove.tile.x){
      monasteries[index].meepleGroup.destroy();
      monasteries[index].player.score += 9; 
      monasteries.splice(index, 1);
    }
  })
}

function Monastery(){
  this.tile;
  this.meeples = [];
  this.meepleGroup = game.add.group();
  game.add.existing(this.meepleGroup);
}
