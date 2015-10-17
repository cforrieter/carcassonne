// // if(placedTile.top == "ROAD"){
// //   added = false;
// //   roads.forEach(function(road){
// //     road.tiles.forEach(function(tile){
// //       if(!added){
// //         if(placedTile.neighbours.top == tile.tile && tile.pos.indexOf("bottom") != -1 && placedTile.neighbours.top.bottom ){
// //           console.log("existing top road");
// //           if(!single){
// //             road.edgeCount -= 1;
// //             allPos = 'top';
// //           }else{
// //             counter = 0;
// //             allPos.forEach(function(pos){
// //               if(placedTile.neighbours[pos]){
// //                 counter += 1;
// //               }
// //             });
// //             road.edgeCount -= counter;
// //             if(counter == 1){
// //               road.edgeCount += 1;
// //             }
// //             allPos = allPos.join('');
// //           }
// //           road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
// //           added = true;
// //         }
// //       }
// //     });
// //   });
// //   if(!added && !single){
// //     console.log("new top road");
// //     newRoad = new Road();
// //     if(single){
// //         newRoad.edgeCount = 2;
// //     }else{
// //       newRoad.edgeCount = 1;
// //       allPos = 'top';
// //     }
// //     newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
// //     roads.push(newRoad);
// //     added = true;
// //   }else{
// //     roadToAdd = 'top';
// //   }
// // }
//
//
// // if(placedTile.left == "ROAD"){
// //   if(!single) { added = false; }
// //   roads.forEach(function(road){
// //     road.tiles.forEach(function(tile){
// //       if(!added){
// //         if(placedTile.neighbours.left == tile.tile && tile.pos.indexOf("right") != -1 && placedTile.neighbours.left.right){
// //           console.log("existing left road");
// //           if(!single){
// //             road.edgeCount -= 1;
// //             allPos = 'left';
// //           }else{
// //             counter = 0;
// //             allPos.forEach(function(pos){
// //               if(placedTile.neighbours[pos]){
// //                 counter += 1;
// //               }
// //             });
// //             road.edgeCount -= counter;
// //             if(counter == 1){
// //               road.edgeCount += 1;
// //             }
// //             allPos = allPos.join('');
// //           }
// //           road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
// //           added = true;
// //         }
// //       }
// //     });
// //   });
// //   if(!added && !single){
// //     console.log("new left road");
// //     newRoad = new Road();
// //     if(single){
// //         newRoad.edgeCount = 2;
// //     }else{
// //       newRoad.edgeCount = 1;
// //       allPos = 'left';
// //     }
// //     newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
// //     roads.push(newRoad);
// //     added = true;
// //   }else{
// //     roadToAdd = 'left';
// //   }
// // }
//
//
//
//
//
//     if(placedTile.right == "ROAD"){
//       if(!single) { added = false; }
//       roads.forEach(function(road){
//         road.tiles.forEach(function(tile){
//           if(!added){
//             if(placedTile.neighbours.right == tile.tile && tile.pos.indexOf("left") != -1 && placedTile.neighbours.right.left){
//               console.log("existing right road");
//               if(!single){
//                 road.edgeCount -= 1;
//                 allPos = 'right';
//               }else{
//                 counter = 0;
//                 allPos.forEach(function(pos){
//                   if(placedTile.neighbours[pos]){
//                     counter += 1;
//                   }
//                 });
//                 road.edgeCount -= counter;
//                 if(counter == 1){
//                   road.edgeCount += 1;
//                 }
//                 allPos = allPos.join('');
//               }
//               road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
//               added = true;
//             }
//           }
//         });
//       });
//       if(!added && !single){
//         console.log("new right road");
//         newRoad = new Road();
//         if(single){
//             newRoad.edgeCount = 2;
//         }else{
//           newRoad.edgeCount = 1;
//           allPos = 'right';
//         }
//
//         newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
//         roads.push(newRoad);
//         added = true;
//       }else{
//         roadToAdd = 'right';
//       }
//     }
//
//     if(added && single){
//       return;
//     }
//
//     if(placedTile.bottom == "ROAD"){
//       if(!single) { added = false; }
//       roads.forEach(function(road){
//         road.tiles.forEach(function(tile){
//           if(!added){
//             if(placedTile.neighbours.bottom == tile.tile && tile.pos.indexOf("top") != -1 && placedTile.neighbours.bottom.top){
//               console.log("existing bottom road");
//               if(!single){
//                 road.edgeCount -= 1;
//                 allPos = 'bottom';
//               }else{
//                 counter = 0;
//                 allPos.forEach(function(pos){
//                   if(placedTile.neighbours[pos]){
//                     counter += 1;
//                   }
//                 });
//                 road.edgeCount -= counter;
//                 if(counter == 1){
//                   road.edgeCount += 1;
//                 }
//                 allPos = allPos.join('');
//               }
//               road.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus});
//               added = true;
//             }
//           }
//         });
//       });
//       if(!added && !single ){
//         console.log("new bottom road");
//         newRoad = new Road();
//         if(single){
//             newRoad.edgeCount = 2;
//         }else{
//           newRoad.edgeCount = 1;
//           allPos = 'bottom';
//         }
//         newRoad.tiles.push({ tile: placedTile, pos: allPos, terminus: placedTile.centerTerminus });
//         roads.push(newRoad);
//         added = true;
//       }else{
//         roadToAdd = 'bottom';
//       }
//     }
//
