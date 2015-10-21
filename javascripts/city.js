var cities = [];

var backwards = {
  typeTop: "typeBottom",
  typeRight: "typeLeft",
  typeBottom: "typeTop",
  typeLeft: "typeRight"
};

function getAllCityPositions(placedTile){
  var positions = ['typeTop', 'typeRight', 'typeBottom', 'typeLeft'];
  var allPos = [];
  positions.forEach(function(position){
    if(placedTile[position] == "CITY"){
      allPos.push(position);
    }
  });
  return allPos;
}

function updateEdgeCount(city, count){
  city.edgeCount -= 1;
  city.edgeCount += count;
  // if(count == 1){
  //   city.edgeCount += 1;
  // }
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
  if(city1 == city2){
    city1.edgeCount -= 2;
    return city1;
  }else if(city2){
    var newCity = new City();
    newCity.tiles = city1.tiles.concat(city2.tiles);
    newCity.meeples = city1.meeples.concat(city2.meeples);
    newCity.edgeCount = city1.edgeCount + city2.edgeCount - 1;
    return newCity;
  }else{
    return city1;
  }

}

function checkCityPosition(placedTile, position, single, allPos, validCities){
  var cityToAdd = '';
  var added = false;

  if(placedTile[position] == "CITY"){
    cities.forEach(function(city, index, citiesArray){
      city.tiles.forEach(function(tile){
        if(!added){
          if(placedTile.neighbours[position] == tile.tile && tile.pos.indexOf(backwards[position]) != -1){
            console.log("existing " + position + " city");
            if(!single){
              city.edgeCount -= 1;
              allPos = position;
            }else{
              if(placedTile.numNeighbours("CITY") > 1){
                var cityToMerge, mergedCity, originalCity = city;
                console.log("Merging cities");

                //remove the current position from check since we're merging / accounting for it now
                var index = allPos.indexOf(position);
                allPos.splice(index, 1);

                remainingPos = allPos;

                originalCity.tiles.push({ tile: placedTile, pos: allPos});
                remainingPos.forEach(function(pos){
                  cityToMerge = findAdjacentCity(placedTile, pos);

                  originalCity = mergeCities(originalCity, cityToMerge);

                  //remove city from array, since it's being merged into a new city
                  citiesArray.splice(citiesArray.indexOf(cityToMerge), 1);
                });

                //remove original city
                citiesArray.splice(citiesArray.indexOf(city), 1);
                //add newly merged city
                citiesArray.push(originalCity);
                if(originalCity.meeples.length === 0){
                  validCities.push({ pos: 'typeCenter', scoringObject: newRoad });
                }
                added = true;
                console.log("Newly merged city has edgecount = ", originalCity.edgeCount);
              }
              var counter = getEdges(placedTile, allPos);
              updateEdgeCount(city, counter);
              allPos = allPos.join('');
          }
          if(!added){
            city.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
            added = true;
            console.log("city has edgecount = ", city.edgeCount);
            if(city.meeples.length === 0){
              if(single){
                validCities.push({ pos: 'typeCenter', scoringObject: city });
              }else{
                validCities.push({ pos: position, scoringObject: city });
              }
            }
          }
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
        validCities.push({ pos: position, scoringObject: newCity });
        added = true;
        meeples = false;
      }else{
        cityToAdd = position;
      }
    }
  }
  return [added, cityToAdd, meeples];
}

function addToCity(placedTile){
    var positions = ['typeTop', 'typeRight', 'typeBottom', 'typeLeft'];
    var added = false, newCity, single = false, counter;
    var cityToAdd = '';
    var returned = [];
    var done = false;
    var validCities = [];
    var meeplePlaced = false;

    if(placedTile.centerCity){
      single = true;
    }

   var allPos = getAllCityPositions(placedTile);

    positions.forEach(function(pos){
      if(!done){
        returned = checkCityPosition(placedTile, pos, single, allPos, validCities);
        added = returned[0];
        cityToAdd += returned[1];
        meeplePlaced = returned[2];
        if(added){
          // if(!meeplePlaced){
            // if(single){
            //   validCities.push("typeCenter");
            // }else{
            //   validCities.push(pos);
            // }
          // }
          if(single){
            done = true;
          }
        }
      }
    });

    if(!added && single){
      console.log("new " + cityToAdd + " city");
      newCity = new City();
      newCity.edgeCount = getEdges(placedTile, allPos);
      newCity.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
      cities.push(newCity);
      validCities.push({ pos: 'typeCenter', scoringObject: newCity });
    }
  return validCities;
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

function scoreCity(city, playerArray){
  var points = city.tiles.length;
  console.log("The closing city was worth " + points + " points.");
  var players, winners;
  // city.meeples.forEach(function(meeple){
  //   players[meeple] ? players[meeple] += 1 : players[meeple] = 1;
  // });
  // //find the player with the most meeples
  // var max = 0;
  // for(var player in players){
  //   if(players[player] > max){
  //     max = players[player];
  //   }
  // }
  //
  // //aware points to all the people with the max # of meeples
  // for(var p in players){
  //   if(players[p] == max){
  //     playerArray[p].score += points;
  //   }
  // }

}

function checkFinishedCities(playerArray){
  var citiesToRemove = [];
  cities.forEach(function(city, index){
    if(city.edgeCount === 0){
      scoreCity(city, playerArray);
      console.log("Closed city!");
      citiesToRemove.push(city);
    }
  });

  citiesToRemove.forEach(function(city){
    cities.splice(cities.indexOf(city), 1);
  });
}

function City(){
  this.tiles = [];
  this.meeples = [];
  this.edgeCount = 0;
}
