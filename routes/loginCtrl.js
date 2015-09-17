var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {

  console.log("username = "+req.body.name);
  console.log("password = "+req.body.password);

  if(req.body.name!=undefined) {
    if(req.body.name=="admin")
      if(req.body.password=="admin")
         res.send("success");
  }
  res.send("failed");
});

module.exports = router;