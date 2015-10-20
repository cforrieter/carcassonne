var cities = [];

var backwards = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};

function getAllCityPositions(placedTile){
  var positions = ['top', 'right', 'bottom', 'left'];
  var allPos = [];
  positions.forEach(function(position){
    if(placedTile[position] == "CITY"){
      allPos.push(position);
    }
  });
  return allPos;
}

function updateEdgeCount(city, count){
  city.edgeCount -= count;
  if(count == 1){
    city.edgeCount += 1;
  }
}

function findCity(searchTile, pos){
  var cityToReturn;
  cities.forEach(function(city){
    city.tiles.forEach(function(tile){
      if(searchTile == tile.tile && tile.pos.indexOf(pos) != -1){
        cityToReturn = city;
      }
    });
  });
  return cityToReturn;
}

function findAdjacentCity(searchTile, pos){
  var cityToReturn;
  cities.forEach(function(city){
    city.tiles.forEach(function(tile){
      if(searchTile.neighbours[pos] == tile.tile && tile.pos.indexOf(backwards[pos]) != -1 && searchTile.neighbours[pos][backwards[pos]] ){
        cityToReturn = city;
      }
    });
  });
  return cityToReturn;
}

function mergeCities(city1, city2){
  var newCity = new City();
  newCity.tiles = city1.tiles.concat(city2.tiles);
  newCity.meeples = city1.meeples.concat(city2.meeples);
  newCity.edgeCount = city1.edgeCount + city2.edgeCount;
  return newCity;
}

function checkCityPosition(placedTile, position, single, allPos, existingCity){
  var cityToAdd = '';
  var added = false;
  var meeples;
  if(placedTile[position] == "CITY"){
    cities.forEach(function(city, index, citiesArray){
      city.tiles.forEach(function(tile){
        if(!added){
          if(placedTile.neighbours[position] == tile.tile && tile.pos.indexOf(backwards[position]) != -1 && placedTile.neighbours[position][backwards[position]] ){
            console.log("existing " + position + " city");
            if(!single){
              city.edgeCount -= 1;
              allPos = position;
            }else{
              var counter = getEdges(placedTile, allPos);
              updateEdgeCount(city, counter);
              if(placedTile.numNeighbours("CITY") > 1 && city.edgeCount !== 0){
                var cityToMerge, mergedCity, originalCity = city;
                console.log("Merging cities");

                //remove the current position from check since we're merging / accounting for it now
                var index = allPos.indexOf(position);
                allPos.splice(index, 1);

                remainingPos = allPos;

                city.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
                remainingPos.forEach(function(pos){
                  cityToMerge = findAdjacentCity(placedTile, pos);

                  //remove city from array, since it's being merged into a new city
                  citiesArray.splice(citiesArray.indexOf(cityToMerge), 1);
                  originalCity = mergeCities(originalCity, cityToMerge);
                });

                //remove original city
                citiesArray.splice(citiesArray.indexOf(city), 1);
                //add newly merged city
                citiesArray.push(originalCity);
              }
              allPos = allPos.join('');
          }
          city.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
          added = true;
          meeples = (city.meeples.length > 0) ? false : true;
        }
      }
      });
    });
    if(!added){
      if(!single){
        console.log("new " + position + " city");
        newCity = new City();
        newCity.edgeCount = 1;
        allPos = position;
        newCity.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
        cities.push(newCity);
        added = true;
        meeples = (city.meeples.length > 0) ? false : true;
      }else{
        cityToAdd = position;
      }
    }
  }
  return [added, cityToAdd, meeples];
}

function addToCity(placedTile){
    var positions = ['top', 'right', 'bottom', 'left'];
    var added = false, newCity, single = false, counter;
    var cityToAdd = '';
    var returned = [];
    var done = false;
    var validRoads = '';
    var meeplePlaced = false;

    if(placedTile.centerCity){
      single = true;
    }

   var allPos = getAllCityPositions(placedTile);

    positions.forEach(function(pos){
      if(!done){
        returned = checkCityPosition(placedTile, pos, single, allPos);
        added = returned[0];
        cityToAdd += returned[1];
        meeplePlaced = returned[2];
        if(added){
          if(!meeplePlaced){
          validRoads += pos;
          }
          if(single){
            done = true;
          }
        }
      }
    });

    if(!added && cityToAdd){
      console.log("new " + cityToAdd + " city");
      newCity = new City();
      validRoads += pos;
      newCity.edgeCount = 2;
      newCity.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
      cities.push(newCity);
    }
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

function scoreCity(city, playerArray){
  var points = city.tiles.length;
  var players, winners;
  city.meeples.forEach(function(meeple){
    players[meeple] ? players[meeple] += 1 : players[meeple] = 1;
  });
  //find the player with the most meeples
  var max = 0;
  for(var player in players){
    if(players[player] > max){
      max = players[player];
    }
  }

  //aware points to all the people with the max # of meeples
  for(var p in players){
    if(players[p] == max){
      playerArray[p].score += points;
    }
  }

}

function checkFinishedCities(playerArray){
  var terminusCount, key;
  cities.forEach(function(city, index){
    if(city.edgeCount === 0){
      scoreCity(city, playerArray);
      console.log("Closed city!");
      cities.splice(index, 1);
    }
  });
}

function City(){
  this.tiles = [];
  this.meeples = [];
}
