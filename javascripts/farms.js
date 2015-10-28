var farms = [];
var farmCount = 0;

Tile.FARMS = {
  B: [{edges: 'ABCDEFGH', hasCity: false, position: 'typeCenter'}],
  A: [{edges: 'ABCDEFGH', hasCity: false, position: 'typeCenter'}],
  C: [],
  R: [{edges: 'FE'    , hasCity: true,  position: 'typeCenter'}],
  Q: [{edges: 'FE'    , hasCity: true,  position: 'typeCenter'}],
  T: [{edges: 'F'     , hasCity: true,  position: 'typeLeft'  }, {edges: 'E', hasCity: true, position: 'typeRight'}],
  S: [{edges: 'F'     , hasCity: true,  position: 'typeLeft'  }, {edges: 'E', hasCity: true, position: 'typeRight'}],
  N: [{edges: 'FEDC'  , hasCity: true,  position: 'typeCenter'}],
  M: [{edges: 'FEDC'  , hasCity: true,  position: 'typeCenter'}],
  P: [{edges: 'FC'    , hasCity: true,  position: 'typeCenter'}, {edges: 'ED', hasCity: false, position: 'typeRight'}],
  O: [{edges: 'FC'    , hasCity: true,  position: 'typeCenter'}, {edges: 'ED', hasCity: false, position: 'typeRight'}],
  G: [{edges: 'FE'    , hasCity: true,  position: 'typeBottom'}, {edges: 'AB', hasCity: true,  position: 'typeTop'}],
  F: [{edges: 'FE'    , hasCity: true,  position: 'typeBottom'}, {edges: 'AB', hasCity: true,  position: 'typeTop'}],
  I: [{edges: 'FEDC'  , hasCity: true,  position: 'typeCenter'}],
  H: [{edges: 'CDHG'  , hasCity: true,  position: 'typeCenter'}],
  E: [{edges: 'HGFEDC', hasCity: true,  position: 'typeCenter'}],
  K: [{edges: 'GF'    , hasCity: false, position: 'typeLeft'  }, {edges: 'HCDE'  , hasCity: true,  position: 'typeCenter'}],
  J: [{edges: 'HGFC'  , hasCity: true,  position: 'typeCenter'}, {edges: 'DE'    , hasCity: false, position: 'typeRight' }],
  L: [{edges: 'HC'    , hasCity: true,  position: 'typeCenter'}, {edges: 'GF'    , hasCity: false, position: 'typeLeft'  }, {edges: 'ED', hasCity: false, position: 'typeRight'}],
  U: [{edges: 'AHGF'  , hasCity: false, position: 'typeLeft'  }, {edges: 'BCDE'  , hasCity: false, position: 'typeRight' }],
  V: [{edges: 'GF'    , hasCity: false, position: 'typeLeft'  }, {edges: 'HABCDE', hasCity: false, position: 'typeCenter'}],
  W: [{edges: 'HABC'  , hasCity: false, position: 'typeCenter'}, {edges: 'GF'    , hasCity: false, position: 'typeLeft'  }, {edges: 'ED', hasCity: false, position: 'typeRight'}],
  X: [{edges: 'AH'    , hasCity: false, position: 'typeTop'   }, {edges: 'BC'    , hasCity: false, position: 'typeRight' }, {edges: 'DE', hasCity: false, position: 'typeBottom'}, {edges: 'GF', hasCity: false, position: 'typeLeft'}],
  D: [{edges: 'HC'    , hasCity: true,  position: 'typeTop'   }, {edges: 'GFED'  , hasCity: false, position: 'typeBottom'}]
};

Tile.prototype.edgeConnection = function edgeConnection(side, tile, isNeighbour) {
  if (isNeighbour) {

    var EDGES = {
      '0':    { typeLeft: ['C', 'D'], typeRight: ['H', 'G'], typeTop: ['F','E'], typeBottom: ['A', 'B'] },
      '90':   { typeLeft: ['A', 'B'], typeRight: ['F', 'E'], typeTop: ['D','C'], typeBottom: ['G', 'H'] },
      '-180': { typeLeft: ['H', 'G'], typeRight: ['C', 'D'], typeTop: ['A','B'], typeBottom: ['F', 'E'] },
      '-90':  { typeLeft: ['F', 'E'], typeRight: ['A', 'B'], typeTop: ['G','H'], typeBottom: ['D', 'C'] }
    };

    // console.log('connecting on neighbour ', EDGES[tile.angle.toString()][side])
    return EDGES[tile.angle.toString()][side];

  } else {

    var EDGES = {
      '0':    { typeRight: ['C', 'D'], typeLeft: ['H', 'G'], typeBottom: ['F','E'], typeTop: ['A', 'B'] },
      '90':   { typeRight: ['A', 'B'], typeLeft: ['F', 'E'], typeBottom: ['D','C'], typeTop: ['G', 'H'] },
      '-180': { typeRight: ['H', 'G'], typeLeft: ['C', 'D'], typeBottom: ['A','B'], typeTop: ['F', 'E'] },
      '-90':  { typeRight: ['F', 'E'], typeLeft: ['A', 'B'], typeBottom: ['G','H'], typeTop: ['D', 'C'] }
    };

    // console.log('connecting on current ', EDGES[tile.angle.toString()][side])
    return EDGES[tile.angle.toString()][side];
  }

};

Tile.FARMConnections = {
  A: ['B', 'F', 'C', 'H'],
  B: ['A', 'E', 'C', 'G'],
  C: ['D', 'H', 'B', 'F'],
  D: ['C', 'A', 'E', 'G'],
  E: ['F', 'B', 'H', 'D'],
  F: ['E', 'A', 'C', 'G'],
  G: ['H', 'F', 'B', 'D'],
  H: ['G', 'C', 'A', 'E']
};

function addFarms(tile) {

  //variables prefixed with 'n' for neighbour property, 't' for current tile property
  //for each neighbour of the placed tile
  for (var side in tile.neighbours) {
    neighbour = tile.neighbours[side];
    if (neighbour) {
      //for each farm of the current neighbour we are checking
      neighbour.farms.forEach (function(nFarm) {
        //for each edges within the current farm we are checking, filtered by the side this neighbour is on
        nFarm.edges.filter (function(nEdge) {
          // return Tile.neighbourEDGES[side].indexOf(nEdge) >= 0;
          return tile.edgeConnection(side, neighbour, true).indexOf(nEdge) >= 0;
        })
        //for each edge letter that passes the filter see if there is a matching edge letter on the placed tile
        .forEach (function(nEdge) {
          //for each farm on the placed tile
          tile.farms.forEach (function(tFarm) {
            //for each edges on the currently checked farm filter only the letters for the edge that match the neighbour side
            tFarm.edges.filter (function(tEdge) {
              // return Tile.currentEDGES[side].indexOf(tEdge) >= 0;
              return tile.edgeConnection(side, tile, false).indexOf(tEdge) >= 0;
            })
            .forEach (function(tEdge) {
              // console.log('checking neighbour edge: ', nEdge, 'with tile edge: ', tEdge)
              //take the neighbour edges and compare with placed tile edges after converting their edge letter to acceptable connection letters
              // console.log(nEdge, 'inside', Tile.FARMConnections[tEdge], '?', Tile.FARMConnections[tEdge].indexOf(nEdge) >= 0)
              if (Tile.FARMConnections[tEdge].indexOf(nEdge) >= 0) {
                if (tFarm.parent === undefined) {   //if current tile doesn't have a parent take it from the neighbour
                  tFarm.parent = nFarm.parent;
                  nFarm.parent.children.push(tFarm);
                  // console.log('adding new farm to neighbour')
                } else if(tFarm.parent == nFarm.parent) {
                  // console.log('farms already connected')
                  return;
                } else {
                  // console.log('incorporating neighbour farms to tile farms parent')
                  var toDelete = nFarm.parent;
                  tFarm.parent.meeples = tFarm.parent.meeples.concat(nFarm.parent.meeples);
                  nFarm.parent.meepleGroup.moveAll(tFarm.parent.meepleGroup);
                  game.world.bringToTop(tFarm.parent.meepleGroup);
                  nFarm.parent.children.forEach (function(farm) {
                    farm.parent = tFarm.parent;
                    tFarm.parent.children.push(farm);
                  });
                  farms.splice(farms.indexOf(toDelete), 1);
                }
              } else {
                return;
              }
            });
          });
        });
      });
    }
  }

  var farmEdges = [];

  tile.farms.forEach (function(farm) {
    if (farm.parent === undefined) {
      // console.log('creating new farm')
      var farmObject = {};
      farms.push(farmObject);
      farmObject.id = farmCount;
      farmCount += 1;
      farmObject.meeples = [];
      farmObject.meepleGroup = game.add.group();
      farm.parent = farmObject;
      farmObject.children = [farm];
      farmObject.tiles = [];
    }

  // this array pre rotates the allowable sides to that when it is unrotated we end up at the original layout
  var POSITION = {
    '0': {typeTop: 'typeTop', typeRight: 'typeRight', typeBottom: 'typeBottom', typeLeft: 'typeLeft', typeCenter: 'typeCenter' },
    '90': {typeTop: 'typeRight', typeRight: 'typeBottom', typeBottom: 'typeLeft', typeLeft: 'typeTop', typeCenter: 'typeCenter' },
    '-180': {typeTop: 'typeBottom', typeRight: 'typeLeft', typeBottom: 'typeTop', typeLeft: 'typeRight', typeCenter: 'typeCenter' },
    '-90': {typeTop: 'typeLeft', typeRight: 'typeTop', typeBottom: 'typeRight', typeLeft: 'typeBottom', typeCenter: 'typeCenter' }
  };

  if (farm.parent.meeples.length == 0) {
    farmEdges.push({pos: POSITION[tile.angle.toString()][farm.position], scoringID: farm.parent.id});
  }

  });

  return farmEdges;

}

var endGameFarms = [];

function scoreFarms() {
  var farmsToScore = [];
  var farmsScores = [];
  var scoringPlayers = [];
  completedCities.forEach(function(city) {
    city.tiles.forEach(function(tilePiece) {
      tilePiece.tile.farms.forEach(function(farm){
        if (farm.hasCity && farmsToScore.indexOf(farm.parent) == -1) {
          farmsToScore.push(farm.parent)
          farmsScores[farmsToScore.length -1] = 0;
        }
      })
    })
    farmsToScore.forEach(function(farm, index) {
      scoringPlayers[index] = [];
      var meepCount = [0, 0, 0, 0, 0];
      farm.meeples.forEach(function(meep) {
        meepCount[globalPlayers.indexOf(meep)] += 1;
      })
      for(var i = 0; i < globalPlayers.length; i++){
        if(meepCount[i] == Math.max(meepCount[0], meepCount[1], meepCount[2], meepCount[3], meepCount[4]) && meepCount[i] > 0) {
          // globalPlayers[i].score += 3;
          scoringPlayers[index].push(globalPlayers[i].name);
          farmsScores[index] += 3;
        }
      }
    })
  })
  farmsToScore.forEach(function(farm, index){
    farm.children.forEach(function(obj){
      farm.tiles.push(obj);
    })
    if(farmsScores[index] > 0){
      endGameFarms.push([farm, farmsScores[index], scoringPlayers[index]]);
    }
  })
}
