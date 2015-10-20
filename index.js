//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/carcassonne';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);
    dropCollection(db);
    insertTiles(db);
  }
});

function dropCollection(db){
  collection = db.collection('tiles');
  collection.remove({});
}

function insertTiles(db){
  // Get the documents collection
  var collection = db.collection('tiles');

  //Create some tiles
  var tile1 = {
     'type':'1',
     'top':{'condition':'road','meeple':'player1'},
     'right':'city',
     'bottom':'road',
     'left':'road',
     'center': {'condition': 'terminus'},
     'banner':false,
     'position':{'x':0,'y':0}
   };
   var tile2 = {
     'type':'2',
     'top':{'condition':'road'},
     'right':'city',
     'bottom':{'condition':'road'},
     'left':'road',
     'center':{'condition': 'terminus'},
     'banner':false,
     'position':{'x':0,'y':1},
   };
  // Insert some users
  collection.insert([tile1, tile2], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Inserted %d documents into the "tiles" collection. The documents inserted with "_id" are:', result.length, result);
    }
  });
  //Close connection
}

function loadDeck(db){
  var collection = db.collection('tiles');

  collection.find(  ).each(function(err, doc){
    if (err) {
        console.log(err);
      } else {
        console.log('Fetched:', doc);
      }
  });
}
