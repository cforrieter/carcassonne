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
      'top':'road', 
      'right':'city', 
      'bottom':'road',
      'left':'road',
      'center':'terminus',
      'banner':false,
      'position':{'x':0,'y':0},
      'meeple':{'player':1,'position':2}
    };
    var tile2 = {
      'type':'V',
      'top':'field', 
      'right':'field', 
      'bottom':'road',
      'left':'road',
      'center':'road',
      'banner':false,
      'coords':null,
      'meeple':null
    };
    var tile3 = {
      'type':'E',
      'top':'city', 
      'right':'field', 
      'bottom':'field',
      'left':'field',
      'center':'field',
      'banner':false,
      'position':null,
      'meeple':null
    };
    var tile4 = {
      'type':'L',
      'top':'road', 
      'right':'city', 
      'bottom':'road',
      'left':'road',
      'center':'terminus',
      'banner':false,
      'position':{'x':0,'y':1},
      'meeple':null
    };
    var tile5 = {
      'type':'V',
      'top':'field', 
      'right':'field', 
      'bottom':'road',
      'left':'road',
      'center':'road',
      'banner':false,
      'position':null,
      'meeple':null
    };
    var tile6 = {
      'type':'E',
      'top':'city', 
      'right':'field', 
      'bottom':'field',
      'left':'field',
      'center':'field',
      'banner':false,
      'position':null,
      'meeple':null
    };
    collection.insert([tile1, tile4], function (err, result) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Inserted %d tiles into the "tiles" collection.' +
        ' The documents inserted with "_id" are:', result.length, result);
      }
    })
  }
})
