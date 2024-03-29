var express = require("express");
var router = express.Router();

var grafica = require("../modules/grafica");

//get all grafica
router.post("/grapos", function (req, res, next) {
  var graData = {
    ...req.body
  };
  console.log(graData);
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

router.post("/gracul", function (req, res, next) {
  var graData = {
    ...req.body
  };
  console.log(graData);

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

//get plantas grafica
router.post("/grapla", function (req, res, next) {
  var graData = {
    ...req.body
  };
  console.log(graData);
  grafica.plaData(graData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get monitoreo diversificados grafica
router.post("/gramon", function (req, res, next) {
  var graData = {
    ...req.body
  };
  console.log(graData);
  grafica.monData(graData, function (error, data) {
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