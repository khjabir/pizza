var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {

  console.log("body is: "+req.body.name);

  var mongodb = require('mongodb');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pizzaDB';

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      var collection = db.collection('orderDetails');


      collection.update({"mob":req.body.name},{$set:{'deliveryStatus':'Deliverd'}}, function (err, numUpdated) {
        if (err) {
          console.log(err);
        } else if (numUpdated) {
          console.log('Updated Successfully'+numUpdated+' document(s).');
          res.send('success')
        } else {
          console.log('No document found with defined "find" criteria!');
        }
      });

    }
  });



});

module.exports = router;