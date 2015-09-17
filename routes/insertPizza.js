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
      var collection = db.collection('orderDetails');

      collection.insert(req.body, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('Inserted %d documents into the "pizzaOrder" collection. The documents inserted with "_id" are:', result.length, result);
            }
        res.send('Got it here'+JSON.stringify(req.body));
        });

      
    }
  });
});

module.exports = router;
