var farms = []

// Tile.prototype.localCoords = function localCoords(node, angle) {
//   //angle is in degrees

//   var coords = {
//   'xA': [-45, -45], 'xB': [0 , -45], 'xC': [45, -45],
//   'xD': [-45, 0], 'xEa': [0, -20], 'xE': [0, 0], 'xEb': [0, 20], 'xF': [45 , 0],
//   'xG': [-45, 45], 'xH': [0, 45], 'xI': [45, 45]
//   }

//   var localX = coords[node][0];
//   var localY = coords[node][1];

//   var xcoord = localX * Math.cos(Phaser.Math.degToRad(angle)) - localY * Math.sin(Phaser.Math.degToRad(angle));
//   var ycoord = localX * Math.sin(Phaser.Math.degToRad(angle)) + localY * Math.cos(Phaser.Math.degToRad(angle));

//   return {x: xcoord, y: ycoord};
// }

Tile.FARMS = {
  B: [{edges: 'ABCDEFGH'.split(''), hasCity: false}],
  A: [{edges: 'ABCDEFGH'.split(''), hasCity: false}],
  C: [],
  R: [{edges: 'FE'.split(''), hasCity: true}],
  Q: [{edges: 'FE'.split(''), hasCity: true}],
  T: [{edges: 'F'.split(''), hasCity: true}, {edges: 'E'.split(''), hasCity: true}],
  S: [{edges: 'F'.split(''), hasCity: true}, {edges: 'E'.split(''), hasCity: true}],
  N: [{edges: 'FEDC'.split(''), hasCity: true}],
  M: [{edges: 'FEDC'.split(''), hasCity: true}],
  P: [{edges: 'FC'.split(''), hasCity: true}, {edges: 'ED'.split(''), hasCity: false}],
  O: [{edges: 'FC'.split(''), hasCity: true}, {edges: 'ED'.split(''), hasCity: false}],
  G: [{edges: 'FE'.split(''), hasCity: true}, {edges: 'AB'.split(''), hasCity: true}],
  F: [{edges: 'FE'.split(''), hasCity: true}, {edges: 'AB'.split(''), hasCity: true}],
  I: [{edges: 'FEDC'.split(''), hasCity: true}],
  H: [{edges: 'CDHG'.split(''), hasCity: true}],
  E: [{edges: 'HGFEDC'.split(''), hasCity: true}],
  K: [{edges: 'GF'.split(''), hasCity: false}, {edges: 'HCDE'.split(''), hasCity: true}],
  J: [{edges: 'HGFC'.split(''), hasCity: true}, {edges: 'DE'.split(''), hasCity: false}],
  L: [{edges: 'HC'.split(''), hasCity: true}, {edges: 'GF'.split(''), hasCity: false}, {edges: 'ED'.split(''), hasCity: false}],
  U: [{edges: 'AHGF'.split(''), hasCity: false}, {edges: 'BCDE'.split(''), hasCity: false}],
  V: [{edges: 'GF'.split(''), hasCity: false}, {edges: 'HABCDE'.split(''), hasCity: false}],
  W: [{edges: 'HABC'.split(''), hasCity: false}, {edges: 'GF'.split(''), hasCity: false}, {edges: 'ED'.split(''), hasCity: false}],
  X: [{edges: 'AH'.split(''), hasCity: false}, {edges: 'BC'.split(''), hasCity: false}, {edges: 'DE'.split(''), hasCity: false}, {edges: 'GF'.split(''), hasCity: false}],
  D: [{edges: 'HC'.split(''), hasCity: true}, {edges: 'GFED'.split(''), hasCity: false}]
}

Tile.prototype.edgeConnection = function edgeConnection(side, tile, isNeighbour) {
  if (isNeighbour) {

    var EDGES = {
      '0':    { typeLeft: ['C', 'D'], typeRight: ['H', 'G'], typeTop: ['F','E'], typeBottom: ['A', 'B'] },      
      '90':   { typeLeft: ['A', 'B'], typeRight: ['F', 'E'], typeTop: ['D','C'], typeBottom: ['G', 'H'] },
      '-180': { typeLeft: ['H', 'G'], typeRight: ['C', 'D'], typeTop: ['A','B'], typeBottom: ['F', 'E'] },
      '-90':  { typeLeft: ['F', 'E'], typeRight: ['A', 'B'], typeTop: ['G','H'], typeBottom: ['D', 'C'] }
    }

    // console.log('connecting on neighbour ', EDGES[tile.angle.toString()][side])
    return EDGES[tile.angle.toString()][side];

  } else {

    var EDGES = {
      '0':    { typeRight: ['C', 'D'], typeLeft: ['H', 'G'], typeBottom: ['F','E'], typeTop: ['A', 'B'] },      
      '90':   { typeRight: ['A', 'B'], typeLeft: ['F', 'E'], typeBottom: ['D','C'], typeTop: ['G', 'H'] },
      '-180': { typeRight: ['H', 'G'], typeLeft: ['C', 'D'], typeBottom: ['A','B'], typeTop: ['F', 'E'] },
      '-90':  { typeRight: ['F', 'E'], typeLeft: ['A', 'B'], typeBottom: ['G','H'], typeTop: ['D', 'C'] }
    }

    // console.log('connecting on current ', EDGES[tile.angle.toString()][side])
    return EDGES[tile.angle.toString()][side];
  }

}

Tile.FARMConnections = {
  A: ['B', 'F', 'C', 'H'], B: ['A', 'E', 'C', 'G'], C: ['D', 'H', 'B', 'F'], D: ['C', 'A', 'E', 'G'], E: ['F', 'B', 'H', 'D'], F: ['E','A', 'C', 'G'], G: ['H', 'F', 'B', 'D'], H: ['G', 'C', 'A', 'E']
}

// Tile.ROADS = {
//   B: [],
//   A: [['xE', 'xH']],
//   C: [],
//   R: [],
//   Q: [],
//   T: [['xE', 'xH']],
//   S: [['xE', 'xH']],
//   N: [],
//   M: [],
//   P: [['xH', 'xF']],
//   O: [['xH', 'xF']],
//   G: [],
//   F: [],
//   I: [],
//   H: [],
//   E: [],
//   K: [['xD', 'xH']],
//   J: [['xH', 'xF']],
//   L: [['xD', 'xE'], ['xE', 'xF'], ['xE', 'xH']],
//   U: [['xB', 'xH']],
//   V: [['xD', 'xH']],
//   W: [['xD', 'xE'], ['xE', 'xF'], ['xE', 'xH']],
//   X: [['xD', 'xE'], ['xB', 'xE'], ['xF', 'xE'], ['xH', 'xE']],
//   D: [['xD', 'xF']]
// };

// // TILE COORD POINTS
// // 'xA'   'xB'   'xC'
// //      'xEa'
// // 'xD'   'xE'   'xF'
// //      'xEb'
// // 'xG'   'xH'   'xI'
// // -------------------

// Tile.CITY = {
//   B: [],
//   A: [],
//   C: [],
//   R: [['xG', 'xE'], ['xE','xI']],
//   Q: [['xG', 'xE'], ['xE','xI']],
//   T: [['xG', 'xE'], ['xE','xI']],
//   S: [['xG', 'xE'], ['xE','xI']],
//   N: [['xG', 'xC']],
//   M: [['xG', 'xC']],
//   P: [['xG', 'xC']],
//   O: [['xG', 'xC']],
//   G: [['xG', 'xEb'], ['xEb','xI'], ['xC', 'xEa'], ['xEa', 'xA']],
//   F: [['xG', 'xEb'], ['xEb','xI'], ['xC', 'xEa'], ['xEa', 'xA']],
//   I: [['xG', 'xE'], ['xE', 'xA'], ['xA', 'xEa'], ['xEa', 'xC']],
//   H: [['xI', 'xEb'], ['xEb', 'xG'], ['xA', 'xEa'], ['xEa', 'xC']],
//   E: [['xA', 'xEa'], ['xEa', 'xC']],
//   K: [['xA', 'xEa'], ['xEa', 'xC']],
//   J: [['xA', 'xEa'], ['xEa', 'xC']],
//   L: [['xA', 'xEa'], ['xEa', 'xC']],
//   U: [],
//   V: [],
//   W: [],
//   X: [],
//   D: [['xA', 'xEa'], ['xEa', 'xC']]
// }

var roadNodePairs = []
var cityNodePairs = []
var roadEndPoints = []

function addFarmNodes(tile) {

  //variables prefixed with 'n' for neighbour property, 't' for current tile property
  //for each neighbour of the placed tile
  for (side in tile.neighbours) {
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
                if (tFarm.parent == undefined) {//if current tile doesn't have a parent take it from the neighbour
                  tFarm.parent = nFarm.parent;
                  nFarm.parent.children.push(tFarm);
                  // console.log('adding new farm to neighbour')
                } else if(tFarm.parent == nFarm.parent) {
                  // console.log('farms already connected')
                  return;
                } else {
                  // console.log('incorporating neighbour farms to tile farm')
                  var toDelete = nFarm.parent
                  nFarm.parent.children.forEach (function(farm) {
                    farm.parent = tFarm.parent
                    tFarm.parent.children.push(farm)
                  })
                  farms.splice(farms.indexOf(toDelete), 1);
                }
              } else {
                return;
              }
            })
          })
        })
      })
    }
  }

  tile.farms.forEach (function(farm) {
    if (farm.parent == undefined) {
      // console.log('creating new farm')
      var farmObject = {}
      farms.push(farmObject);
      farmObject.name = Math.random();
      farm.parent = farmObject
      farmObject.children = [farm]
    }
  })

  // console.log(farms)
  // console.log('=========================================')

  // var x = tile.x;
  // var y = tile.y;
  // var angle = tile.angle;

  // Tile.ROADS[tile.tileType].forEach (function(pair) {
  //   var points = tile.localCoords(pair[0], angle)
  //   var firstNode = {x: tile.x + points.x, y: tile.y + points.y};

  //   points = tile.localCoords(pair[1], angle)
  //   var nextNode = {x: tile.x + points.x, y: tile.y + points.y};

  //   var nodePair = {current: {x: firstNode.x, y: firstNode.y}, next: {x: nextNode.x, y: nextNode.y} }
  //   roadNodePairs.push(nodePair);
  // })

  // Tile.CITY[tile.tileType].forEach (function(pair) {
  //   var points = tile.localCoords(pair[0], angle)
  //   var firstNode = {x: tile.x + points.x, y: tile.y + points.y};

  //   points = tile.localCoords(pair[1], angle)
  //   var nextNode = {x: tile.x + points.x, y: tile.y + points.y};

  //   var nodePair = {current: {x: firstNode.x, y: firstNode.y}, next: {x: nextNode.x, y: nextNode.y} }
  //   cityNodePairs.push(nodePair);
  // })

}


function calculateFarms() {


}




function renderFarms() {

  var graphics = game.add.graphics(0, 0);
  graphics.lineStyle(0);

  roadNodePairs.forEach (function(pair) {
    graphics.beginFill(0xFFFF0B);
    // line = new Phaser.Line(pair.current.x, pair.current.y, pair.next.x, pair.next.y)
    // game.debug.geom(line, "#FFFF0B")
    graphics.drawCircle(pair.current.x, pair.current.y, 10);
    graphics.drawCircle(pair.next.x, pair.next.y, 10);
  })
    graphics.endFill();

  cityNodePairs.forEach (function(pair) {
    graphics.beginFill(0xFF9900);
    // line = new Phaser.Line(pair.current.x, pair.current.y, pair.next.x, pair.next.y)
    // game.debug.geom(line, "#FF9900")
    graphics.drawCircle(pair.current.x, pair.current.y, 10);
    graphics.drawCircle(pair.next.x, pair.next.y, 10);
  })

  graphics.endFill();

}









