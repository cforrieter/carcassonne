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
  road.edgeCount -= 1;
  road.edgeCount -= count;
  // if(count == 1){
  //   road.edgeCount += 1;
  // }
}

function mergeRoads(road1, road2) {
  var newRoad = new Road();
  newRoad.tiles = road1.tiles.concat(road2.tiles);
  newRoad.meeples = road1.meeples.concat(road2.meeples);
  newRoad.edgeCount = road1.edgeCount + road2.edgeCount - 1;
  return newRoad;
}

function findRoad(searchTile, pos){
  var roadToReturn;
  roads.forEach(function(road){
    road.tiles.forEach(function(tile){
      if(searchTile == tile.tile && tile.pos.indexOf(pos) != -1){
        roadToReturn = road;
      }
    });
  });
  return roadToReturn;
}

function findAdjacentRoad(searchTile, pos){
  var roadToReturn;
  roads.forEach(function(road){
    road.tiles.forEach(function(tile){
      if(searchTile.neighbours[pos] == tile.tile && tile.pos.indexOf(backwards[pos]) != -1 && searchTile.neighbours[pos][backwards[pos]] ){
        roadToReturn = road;
      }
    });
  });
  return roadToReturn;
}

function mergeCities(road1, road2){
  if(road2){
    var newRoad = new Road();
    newRoad.tiles = road1.tiles.concat(road2.tiles);
    newRoad.meeples = road1.meeples.concat(road2.meeples);
    newRoad.edgeCount = road1.edgeCount + road2.edgeCount - 1;
    return newRoad;
  }else{
    return road1;
  }

}


function checkRoadPosition(placedTile, position, single, allPos, validRoads){
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
              if(placedTile.numNeighbours("ROAD") > 1){
                var roadToMerge, mergedRoad, originalRoad = road;
                console.log("Merging roads");

                //remove the current position from check since we're merging / accounting for it now
                var index = allPos.indexOf(position);
                allPos.splice(index, 1);

                remainingPos = allPos;

                road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
                remainingPos.forEach(function(pos){
                  roadToMerge = findAdjacentRoad(placedTile, pos);

                  //remove road from array, since it's being merged into a new road
                  roadsArray.splice(roadsArray.indexOf(roadToMerge), 1);
                  originalRoad = mergeRoads(originalRoad, roadToMerge);
                });

                //remove original road
                roadsArray.splice(roadsArray.indexOf(road), 1);
                //add newly merged road
                roadsArray.push(originalRoad);
                if(originalRoad.meeples.length === 0){
                  validRoads.push({ pos: position, road: newRoad });
                }
                added = true;
              }
              allPos = allPos.join('');
            }
            if(!added){
              road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
              if(road.meeples.length === 0){
                if(single){
                  validRoads.push({ pos: 'typeCenter', road: road });
                } else {
                  validRoads.push({ pos: position, road: road });
                }
              }
              added = true;
            }
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
        validRoads.push({ pos: position, road: newRoad });
        added = true;
      }else{
        console.log("new road to add at " + position + " road");
        roadToAdd = position;
      }
    }
  }
  return [added, roadToAdd, validRoads];
}

function addToRoad(placedTile){
  console.log(placedTile);
  var positions = ['typeTop', 'typeRight', 'typeBottom', 'typeLeft'];
  var added = false, newRoad, single = false, counter;
  var roadToAdd = '';
  var returned = [];
  var done = false;
  var validRoads = [];
  var meeplePlaced = false;

  if(placedTile.centerRoad){
    single = true;
  }

  var allPos = getAllRoadPositions(placedTile);
  positions.forEach(function(pos){
    if(!done){
      returned = checkRoadPosition(placedTile, pos, single, allPos, validRoads);
      added = returned[0];
      roadToAdd += returned[1];
      validRoads = returned[2];
      // meeplePlaced = returned[2];
      if(added){
        // if(!meeplePlaced){
        //   if(single){
        //     validRoads.push("typeCenter");
        //   }else{
        //     validRoads.push(pos);
        //   }
        // }
        if(single){
          done = true;
        }
      }
    }
  });
  console.log(roadToAdd);
  if(!added && single){
    console.log("new " + roadToAdd + " road");

    newRoad = new Road();
    newRoad.edgeCount = 2;
    newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
    roads.push(newRoad);
    if(single){
      validRoads.push({ pos: "typeCenter", road: newRoad});
    }else{
      validRoads.push({ pos:roadToAdd, road: newRoad });
    }
  }

  return validRoads;
}

function getEdges(tile, allPos){
  counter = 0;
  allPos.forEach(function(pos){
    if(!tile.neighbours[pos]){
      counter += 1;
    }
  });
  return counter;
}

function scoreRoad(road, playerArray){
  var points = road.tiles.length;
  console.log("Closing the road was worth " + points + " points.");
  var players, winners;
  road.meeples.forEach(function(meeple){
    players[meeple] ? players[meeple] += 1 : players[meeple] = 1;
  });
  //find the player with the most meeples
  var max = 0;
  for(var player in players){
    if(players[player] > max){
      max = players[player];
    }
  }

  for(var p in players){
    if(players[p] == max){
      playerArray[p].score += points;
    }
  }

}

function checkFinishedRoads(playerArray){
  var roadsToRemove = [];
  roads.forEach(function(road, index){
    if(road.edgeCount === 0){
      scoreRoad(road, playerArray);
      console.log("Closed road!");
      roadsToRemove.push(road);
    }
  });

  roadsToRemove.forEach(function(road){
    roads.splice(roads.indexOf(road), 1);
  });
}

function Road(){
  this.tiles = [];
  this.meeples = [];
  this.edgeCount = 0;
}
