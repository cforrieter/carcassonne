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

function checkFinishedCities(){
  var terminusCount, key;
  cities.forEach(function(city, index){
    if(city.edgeCount === 0){
      console.log("Closed city!");
      cities.splice(index, 1);
    }
  });
}

function City(){
  this.tiles = [];
  this.meeples = [];
}


Tile.TYPES = {
  ROAD: "ROAD",
  CITY: "CITY",
  FIELD: "FIELD"
};

Tile.KINDS = {
  1: {
    top: Tile.TYPES.FIELD,
    bottom: Tile.TYPES.FIELD,
    left: Tile.TYPES.FIELD,
    right: Tile.TYPES.CITY,
    centerTerminus: true,
    centerRoad: false,
    centerCity: false,
  },
  2: {
    top: Tile.TYPES.CITY,
    bottom: Tile.TYPES.FIELD,
    left: Tile.TYPES.FIELD,
    right: Tile.TYPES.FIELD,
    centerTerminus: true,
    centerCity: false,
  },
  3: {
    top: Tile.TYPES.FIELD,
    bottom: Tile.TYPES.FIELD,
    left: Tile.TYPES.CITY,
    right: Tile.TYPES.FIELD,
    centerTerminus: false,
    centerCity: false
  },
  4: {
    top: Tile.TYPES.ROAD,
    bottom: Tile.TYPES.CITY,
    left: Tile.TYPES.CITY,
    right: Tile.TYPES.CITY,
    centerTerminus: false,
    centerCity: true
  },
  5: {
    top: Tile.TYPES.ROAD,
    bottom: Tile.TYPES.FIELD,
    left: Tile.TYPES.ROAD,
    right: Tile.TYPES.FIELD,
    centerTerminus: false,
    centerCity: true
  },
  6: {
    top: Tile.TYPES.FIELD,
    bottom: Tile.TYPES.ROAD,
    left: Tile.TYPES.ROAD,
    right: Tile.TYPES.FIELD,
    centerTerminus: false,
    centerCity: true
  }
};

function Tile(type) {
  this.type = type;
  this.x = 0;
  this.y = 0;
  this.left = null;
  this.right = null;
  this.top = null;
  this.bottom = null;
  this.neighbours = {
    left: null,
    right: null,
    top: null,
    bottom: null
  };
  this.occupant  = null;
  var kind = Tile.KINDS[type];
  if(!kind){
    throw new Error("Invalid tile type: %s", type);
  }

  for(var k in kind){
    this[k] = kind[k];
  }
}

Tile.prototype.rotate = function(){
  switch(this.type){
    case 'B':
    case 'U':
    case 'X':
      return;
  }

  var x = this.bottom, y = this.left, z = this.top, w = this.right;
  this.left = x;
  this.top = y;
  this.right = z;
  this.bottom = w;
};

Tile.prototype.hasNeighbours = function() { return !!(this.neighbours.left || this.neighbours.right || this.neighbours.top || this.neighbours.bottom); };

Tile.prototype.numNeighbours = function(type) {
  var count = 0;
  for(var key in this.neighbours){
    if(this.neighbours[key] && this[key] == type){
      count += 1;
    }
  }
  return count;
};

var tiles = [];
var playableTiles = "4321".split('').map(function(c) { return new Tile(c); });

function makeGrid(){
  const grid = [];
  tiles.forEach(tile => {
    if(!grid[tile.x])
    {
      grid[tile.x] = [];
    }
    if(!grid[tile.x][tile.y])
    {
      grid[tile.x][tile.y] = []
    }
    grid[tile.x][tile.y] = tile;
  });
  return grid;
}

function playTile(x, y){
  if(playableTiles.length === 0)
  {
    throw new Error("Out of moves");
  }
  var newTile = playableTiles.pop();
  newTile.x = x;
  newTile.y = y;

  console.log(`Playing tile ${newTile.type} on ${newTile.x}, ${newTile.y}`);

  tiles.forEach(oldTile =>
  {
    if(oldTile.x == newTile.x && oldTile.y == newTile.y)
    {
      throw new Error("Space occupied");
    }
    console.log(oldTile.x, oldTile.y, newTile.x, newTile.y);
    //Old tile is the Top Neighbour
    if(oldTile.x == newTile.x && oldTile.y + 1 == newTile.y){
      oldTile.neighbours.top = newTile;
      newTile.neighbours.bottom = oldTile;

      if(oldTile.top != newTile.bottom){
        throw new Error(`Invalid move. ${oldTile.bottom.toString()} does not connect with ${newTile.top.toString()}`);
      }

      console.log("Has top neighbour");
    }
    //Bottom Neighbour
    if(oldTile.x == newTile.x && oldTile.y - 1 == newTile.y){
      oldTile.neighbours.bottom = newTile;
      newTile.neighbours.top = oldTile;

      if(oldTile.bottom != newTile.top){
        throw new Error(`Invalid move. ${oldTile.top.toString()} does not connect with ${newTile.bottom.toString()}`);
      }
      console.log("Has bottom neighbour");
    }

    //Left Neighbour
    if(oldTile.y == newTile.y && oldTile.x + 1 == newTile.x){
      oldTile.neighbours.right = newTile;
      newTile.neighbours.left = oldTile;

      if(oldTile.right != newTile.left){
        throw new Error(`Invalid move. ${oldTile.right} does not connect with ${newTile.left}`);
      }
      console.log("Has left neighbour");
    }
    //Right Neighbour
    if(oldTile.y == newTile.y && oldTile.x - 1 == newTile.x){
      console.log("Checking for right neighbour");
      oldTile.neighbours.left = newTile;
      newTile.neighbours.right = oldTile;

      if(oldTile.left != newTile.right){
        throw new Error(`Invalid move. ${oldTile.left} does not connect with ${newTile.right}`);
      }
      console.log("Has right neighbour");
    }

  });

  // if(!newTile.hasNeighbours() && tiles.length > 0){
  //   inspect(newTile);
  //   throw new Error(`Must be adjacent to another tile. Were playing ${newTile.type} on ${newTile.x}, ${newTile.y}`);
  // }
  tiles.push(newTile);
  return newTile;
}

var tile1 = playTile(0,1);
addToCity(tile1);
console.log(cities);

var tile2 = playTile(1,0);
addToCity(tile2);
console.log(cities);

var tile3 = playTile(2,1);
addToCity(tile3);

var tile4 = playTile(1,1);
addToCity(tile4);


console.log(cities);

checkFinishedCities();
console.log(cities);
return;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/carcassonne';


function translations(side, position) {
  var translate = {
                    top: { x: position.x, y: position.y + 1},
                    right: { x: position.x + 1, y: position.y},
                    bottom: { x: position.x, y: position.y - 1 },
                    left: { x: position.x - 1, y: position.y }
                  };
  return translate[side];
}
var gameState;
var collection;

//app.get('/', function(req, res){
  // res.sendfile('views/index.html');
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      collection = db.collection('tiles');
      collection.find({}).toArray(function(err, items){
          gameState = items;
          collection.findOne(function(err, item){
            var terminusResults = checkForTerminus(tile2, true, 'top');
            console.log(terminusResults);
            var terminus = terminusResults[0].position;
            var direction = terminusResults[1];

            switch(direction){
              case 'top':
                direction = "bottom";
                break;
              case 'bottom':
                break;
            }
            var road = completeRoad(terminus, direction, [], {});
            console.log("ROAD", road);
          });
      });
    }
  });
//});



function checkForTerminus(placedTile, firstTile, direction) {
  console.log("check for terminus called");
  firstTile = firstTile || false;

  //TODO:: gameState.playedTiles
  if(!firstTile){
    //check for teminus -- end condition
    if(placedTile.center == "TERMINUS"){
      return [placedTile, direction];
    }
  }

  //check up for road
  return checkDirection(direction);
  // //check right for road
  // return checkDirection('right');
  // //check down for road
  // return checkDirection('bottom');
  // //check left for road
  // return checkDirection('left');

  function checkDirection(side){
    if(placedTile[side] == "ROAD" && direction != backwards[side]){
      // console.log("tile has a top road");
      direction = side;
      var newTile = tiles.filter(function(tile){
        return tile.x == placedTile.x && tile.y == (placedTile.y + 1);
      })[0];

      return checkForTerminus(newTile, false, direction);
    }
  }
}

function completeRoad(position, direction, currentPath, meeples){

  console.log('completedRoad called');
  console.log('position', position);
  var completedRoad;

  var placedTile = tiles.filter(function(tile){
    return tile.position.x == position.x && tile.position.y == position.y;
  })[0];

  if(!placedTile){
    console.log("exiting recursion");
    return null;
  }

  if(placedTile.center.condition == "terminus"){
    var terminus = true;
    console.log("terminus is true");
    if(currentPath.length > 0){
      findMeeples(placedTile, backwards[direction], 'road');
      //TODO return meeples
      currentPath.push(placedTile);
      return [currentPath, meeples];
    }
  }

  completedRoad = (checkDirection('top') || checkDirection('right') || checkDirection('bottom') || checkDirection('left'));

  return completedRoad;

      function checkDirection(side) {
        if(placedTile[side] == "ROAD" && direction != backwards[side] ){
          console.log(side + ' is a road');
          //remove meeple if present
          if(terminus){
            findMeeples(placedTile, backwards[direction], 'road');
          }else{
            findMeeples(placedTile, 'top', 'road');
            findMeeples(placedTile, 'right', 'road');
            findMeeples(placedTile, 'bottom', 'road');
            findMeeples(placedTile, 'left', 'road');
          }

            var newPosition = translations(side, position);

            currentPath.push(placedTile);
            return completeRoad(newPosition, side, currentPath, meeples);
          }
      }

      function findMeeples(tile, side, condition){
        if(tile[side].meeple && tile[side].condition == condition){
          meeples[tile[side].meeple] === undefined ? meeples[tile[side].meeple] = 1 : meeples[tile[side].meeple] += 1;
          tile[side].meeple = undefined;
        }
      }
}

function score(road){

  // var winner = Object.keys(meeples).reduce(function(maxValue, currentValue));
  //compare meeples for winner
  // addScore(road.length, winner);
}


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    if (msg === 'db'){
      collection.find({}).each(function(err, result){
        if (result) {
          io.emit('chat message', result.name);
        }
      });
    } else {
      io.emit('chat message', msg);
    }
  });

  socket.on('placed tile', function(tile){
    addNewTileToGameState();
    var terminus = checkForTerminus(tile.position);
    var road = completeRoad(terminus.position, [], {});
    console.log(road);
    if(road){
      score(road);
    }

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
