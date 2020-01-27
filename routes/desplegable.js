var express = require("express");
var router = express.Router();

var login = require("../modules/desplegable");

//insert data login
router.post("/desins", function (req, res, next) {

  var proData = req.body
  // console.log(proData);

  login.insData(logData, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update data login
router.put("/desupd/:id", function (req, res, next) {

  var logData = {
    ...req.body
  };
  login.updData(logData, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});


//get one login
router.delete("/desdel/:id", function (req, res, next) {
  var logData = {
    id_login: req.params.id
  };
  // console.log(req.params);

  login.delData(logData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one login
router.post("/desone/:id", function (req, res, next) {
  var logData = {
    id_login: req.params.id
  };
  login.idData(logData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get all login
router.get("/desall", function (req, res, next) {
  var logData = {};
  login.allData(logData, function (error, data) {
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