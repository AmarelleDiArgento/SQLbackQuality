var express = require("express");
var router = express.Router();

var grafica = require("../modules/grafica");

//get all grafica
router.get("/grapos", function (req, res, next) {
  var graData = {};
  grafica.posData(graData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

router.get("/gracul", function (req, res, next) {
  var graData = {};
  grafica.culData(graData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});


//get all grafica
router.post("/graexp", function (req, res, next) {
  var graData = {
    ...req.body
  };
  grafica.expData(graData, function (error, data) {
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