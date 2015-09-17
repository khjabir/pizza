var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {

  //assume that username="admin" and password="admin"
  //can also be implemented by means of database look-up for matching combination
  
  if(req.body.name!=undefined) {
    if(req.body.name=="admin")
      if(req.body.password=="admin")
         res.send("success");
  }
  res.send("failed");
});

module.exports = router;