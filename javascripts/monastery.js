var monasteries = [];
var monasteryNeighbours;

function checkMonasteries(){
  monasteries.forEach(function(monastery){
    if(monastery.neighbours.top){
      monasteryNeighbours ++;
      if(monastery.neighbours.top.neighbours.right){
        monasteryNeighbours ++;
      }
    };
    if(monastery.neighbours.right){
      monasteryNeighbours ++;
      if(monastery.neighbours.right.neighbours.bottom){
        monasteryNeighbours ++;
      }
    };
    if(monastery.neighbours.bottom){
      monasteryNeighbours ++;
      if(monastery.neighbours.bottom.neighbours.left){
        monasteryNeighbours ++;
      }
    };
    if(monastery.neighbours.left){
      monasteryNeighbours ++;
      if(monastery.neighbours.left.neighbours.top){
        monasteryNeighbours ++;
      }
    };
    // console.log(monasteryNeighbours);
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
    if (arrayMonastery.y === monasteryToRemove.y && arrayMonastery.x === monasteryToRemove.x){
      monasteries.splice(index, 1);
    }
  })
}

// console.log(monasteries)
// removeMonastery({x:1,y:1})
// console.log(monasteries)

