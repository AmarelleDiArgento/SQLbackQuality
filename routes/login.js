var express = require("express");
var router = express.Router();

var login = require("../modules/login");

//insert data login
router.post("/logins", function (req, res, next) {

  var logdata = req.body
  // console.log(proData);

  login.insData(logdata, function (error, data) {
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
router.put("/logupd/:id", function (req, res, next) {

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

//get login user
router.post("/login", function (req, res, next) {
  var logData = {
    id_usuario: req.body.id_usuario,
    password: req.body.password
  };
  login.logData(logData, function (error, data) {
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
router.delete("/logdel/:id", function (req, res, next) {
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
router.post("/logone/:id", function (req, res, next) {
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
router.get("/logall", function (req, res, next) {
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