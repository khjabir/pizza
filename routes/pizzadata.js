var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {

  var mongodb = require('mongodb');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pizzaDB';

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      var collection = db.collection('pizzaCollection');

      collection.find().toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
          console.log('Found:', JSON.stringify(result,null,2));
          res.send(result);
        } else {
          console.log('No document(s) found with defined "find" criteria!');
          res.send("Nothing Found")
        }
      });
    }
  });
});

module.exports = router;
