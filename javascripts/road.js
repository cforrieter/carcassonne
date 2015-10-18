var roads = [];

var backwards = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};

function getAllRoadPositions(placedTile){
  var positions = ['top', 'right', 'bottom', 'left'];
  var allPos = [];
  positions.forEach(function(position){
    if(placedTile[position] == "ROAD"){
      allPos.push(position);
    }
  });
  return allPos;
}

function updateEdgeCount(road, count){
  road.edgeCount -= count;
  if(count == 1){
    road.edgeCount += 1;
  }
}

function checkRoadPosition(placedTile, position, single, allPos){
  var roadToAdd = '';
  var added = false;
  if(placedTile[position] == "ROAD"){
    roads.forEach(function(road){
      road.tiles.forEach(function(tile){
        if(!added){
          if(placedTile.neighbours[position] == tile.tile && tile.pos.indexOf(backwards[position]) != -1 && placedTile.neighbours[position][backwards[position]] ){
            console.log("existing " + position + " road");
            if(!single){
              road.edgeCount -= 1;
              allPos = position;
            }else{
              var counter = getEdges(placedTile, allPos);
              updateEdgeCount(road, counter);
              allPos = allPos.join('');
            }
            road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
            added = true;
          }
        }
      });
    });
    if(!added && !single){
      console.log("new " + position + " road");
      newRoad = new Road();
      newRoad.edgeCount = 1;
      allPos = position;
      newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
      roads.push(newRoad);
      added = true;
    }else{
      if(!added){
        roadToAdd = position;
      }
    }
  }
  return [added, roadToAdd];
}

function addToRoad(placedTile){
    var positions = ['top', 'right', 'bottom', 'left'];
    var added = false, newRoad, single, counter;
    var roadToAdd = '';
    var returned = [];
    var done = false;

    if(placedTile.centerCity){
      single = true;
    }

   var allPos = getAllRoadPositions(placedTile);

    positions.forEach(function(pos){
      if(!done){
        returned = checkRoadPosition(placedTile, pos, single, allPos);
        added = returned[0];
        roadToAdd += returned[1];
        if(added && single){
          done = true;
        }
      }
    });

    if(!added && roadToAdd){
      console.log("new " + roadToAdd + " road");
      newRoad = new Road();
      newRoad.edgeCount = 2;
      newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
      roads.push(newRoad);
    }
}

function getEdges(tile, allPos){
  counter = 0;
  allPos.forEach(function(pos){
    if(tile.neighbours[pos]){
      counter += 1;
    }
  });
  return counter;
}

function checkFinishedRoads(){
  var terminusCount, key;
  roads.forEach(function(road, index){
    if(road.edgeCount === 0){
      console.log("Closed road!");
      roads.splice(index, 1);
    }
  });
}

function Road(){
  this.tiles = [];
  this.meeples = [];
  this.edgeCount = 0;
}
