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
    loadTiles(db);
  }
});

function insertTiles(db){
  // Get the documents collection
  var collection = db.collection('tiles');

  //Create some tiles
  var tile1 = {top: "road", right: "field", bottom: "road", left: "field", center: "road", banner: false, meeple: false};
  var tile2 = {top: "city", right: "field", bottom: "road", left: "city", center: "road", banner: false, meeple: true};
  var tile3 = {top: "city", right: "field", bottom: "road", left: "city", center: "road", banner: false, meeple: false};

  // Insert some users
  collection.insert([tile1, tile2, tile3], function (err, result) {
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