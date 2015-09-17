var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {

  var idVal = req.body.name;

  var mongodb = require('mongodb');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/pizzaDB';

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      var collection = db.collection('orderDetails');
      var obj_id = new mongodb.ObjectId(idVal);

      collection.update({"_id":obj_id},{$set:{'deliveryStatus':'Deliverd'}}, function (err, numUpdated) {

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
