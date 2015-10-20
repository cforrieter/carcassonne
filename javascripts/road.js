var roads = [];

var backwards = {
  typeTop: "typeBottom",
  typeRight: "typeLeft",
  typeBottom: "typeTop",
  typeLeft: "typeRight"
};

function getAllRoadPositions(placedTile){
  var positions = ['typeTop', 'typeRight', 'typeBottom', 'typeLeft'];
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

function mergeRoads(road1, road2) {
  var newRoad = new Road();
  newRoad.tiles = road1.tiles.concat(road2.tiles);
  newRoad.meeples = road1.meeples.concat(road2.meeples);
  newRoad.edgeCount = road1.edgeCount + road2.edgeCount;
  return newRoad;
}


function checkRoadPosition(placedTile, position, single, allPos){
  var roadToAdd = '';
  var meeples;
  var added = false;
  if(placedTile[position] == "ROAD"){
    roads.forEach(function(road, firstIndex, roadsArray){
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
              if(placedTile.numNeighbours("ROAD") > 1 && road.edgeCount !== 0){
                  console.log("should merge roads");
                  var index = allPos.indexOf(position);
                  allPos.splice(index, 1);
                  otherPos = allPos.join('');
                  roads.forEach(function(road2, index){
                    road2.tiles.forEach(function(tile){
                      if(placedTile.neighbours[otherPos] == tile.tile && tile.pos.indexOf(backwards[otherPos]) != -1 && placedTile.neighbours[otherPos][backwards[otherPos]] ){
                          var newRoad = mergeRoads(road, road2);
                          newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
                          roadsArray.push(newRoad);
                          roadsArray.splice(index, 1);
                          roadsArray.splice(roadsArray.indexOf(road), 1);
                      }
                    });
                  });
              }
              allPos = allPos.join('');
            }
            road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
            added = true;
            meeples = (road.meeples.length > 0) ? false : true;
          }
        }
      });
    });
    if(!added){
      if(!single){
        console.log("new " + position + " road");
        newRoad = new Road();
        newRoad.edgeCount = 1;
        allPos = position;
        newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
        roads.push(newRoad);
        added = true;
        meeples = false;
      }else{
        console.log("new road to add at " + position + " road");
        roadToAdd = position;
      }
    }
  }
  return [added, roadToAdd, meeples];
}

function addToRoad(placedTile){
  console.log(placedTile);
  var positions = ['typeTop', 'typeRight', 'typeBottom', 'typeLeft'];
  var added = false, newRoad, single, counter;
  var roadToAdd = '';
  var returned = [];
  var done = false;
  var validRoads = [];
  var meeplePlaced = false;

  if(placedTile.centerRoad){
    single = true;
  }

  var allPos = getAllRoadPositions(placedTile);
  // debugger;
  positions.forEach(function(pos){
    if(!done){
      returned = checkRoadPosition(placedTile, pos, single, allPos);
      added = returned[0];
      roadToAdd += returned[1];
      meeplePlaced = returned[2];
      if(added){
        if(!meeplePlaced){
        validRoads.push(pos);
        }
        if(single){
          done = true;
        }
      }
    }
  });
  console.log(roadToAdd);
  if(!added && roadToAdd){
    console.log("new " + roadToAdd + " road");
    validRoads.push(pos);
    newRoad = new Road();
    newRoad.edgeCount = 2;
    newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
    roads.push(newRoad);
  }
  console.log(validRoads);
  
  return validRoads;
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
