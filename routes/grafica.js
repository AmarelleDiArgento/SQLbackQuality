var express = require("express");
var router = express.Router();

var grafica = require("../modules/grafica");

//get all grafica
router.get("/graall", function (req, res, next) {
  var graData = {};
  grafica.allData(graData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

module.exports = router;