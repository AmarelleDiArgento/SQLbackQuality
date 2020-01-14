var express = require("express");
var router = express.Router();

var login = require("../modules/login");

//insert data login
router.post("/logins", function (req, res, next) {
  var logData = {
    id_usuario: req.body.id_usuario,
    nombre_usuario: req.body.nombre_usuario,
    password: req.body.password

  };
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
router.post("/logupd", function (req, res, next) {
  var logData = {
    id_login: req.body.id_login,
    id_usuario: req.body.id_usuario,
    nombre_usuario: req.body.nombre_usuario,
    password: req.body.password

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
router.post("/logone", function (req, res, next) {
  var logData = {
    id_login: req.body.id_login
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