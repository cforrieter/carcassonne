var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/carcassonne';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    var collection = db.collection('tiles');
    collection.remove({});
    var tile1 = {
      'type':'L',
      'top':{'conditon':'road','meeple':'player1'}, 
      'right':{'condition':'city'}, 
      'bottom':{'condition':'road'},
      'left':{'condition':'road'},
      'center'{'condition':'terminus'},
      'banner':false,
      'position':{'x':0,'y':0}
    };
    var tile2 = {
      'type':'L',
      'top':{'conditon':'road'}, 
      'right':{'condition':'city'}, 
      'bottom':{'condition':'road'},
      'left':{'condition':'road'},
      'center'{'condition':'terminus'},
      'banner':false,
      'position':{'x':0,'y':1},
    };
    // var tile2 = {
    //   'type':'V',
    //   'top':'field', 
    //   'right':'field', 
    //   'bottom':'road',
    //   'left':'road',
    //   'center':'road',
    //   'banner':false,
    //   'position':null,
    // };
    // var tile3 = {
    //   'type':'E',
    //   'top':'city', 
    //   'right':'field', 
    //   'bottom':'field',
    //   'left':'field',
    //   'center':'field',
    //   'banner':false,
    //   'position':null,
    //   'meeple':null
    // };
    // var tile5 = {
    //   'type':'V',
    //   'top':'field', 
    //   'right':'field', 
    //   'bottom':'road',
    //   'left':'road',
    //   'center':'road',
    //   'banner':false,
    //   'position':null,
    //   'meeple':null
    // };
    // var tile6 = {
    //   'type':'E',
    //   'top':'city', 
    //   'right':'field', 
    //   'bottom':'field',
    //   'left':'field',
    //   'center':'field',
    //   'banner':false,
    //   'position':null,
    //   'meeple':null
    // };
    collection.insert([tile1, tile2], function (err, result) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Inserted %d tiles into the "tiles" collection.' +
        ' The documents inserted with "_id" are:', result.length, result);
      }
    })

    var cursor = collection.find();
    cursor.toArray(function(err, tiles){
      console.log(tiles);
    })
  }
})

