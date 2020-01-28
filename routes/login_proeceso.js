var express = require("express");
var router = express.Router();

var login_proceso = require("../modules/login_proceso");

//insert data login_proceso
router.post("/logpins", function (req, res, next) {

  var proData = req.body
  // console.log(proData);

  login_proceso.insData(logprodata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update data login_proceso
router.put("/logpupd/:id", function (req, res, next) {

  var logprodata = {
    ...req.body
  };
  login_proceso.updData(logprodata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get login_proceso user
router.post("/login_proceso", function (req, res, next) {
  var logprodata = {
    id_usuario: req.body.id_usuario,
    password: req.body.password
  };
  login_proceso.logprodata(logprodata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one login_proceso
router.delete("/logpdel/:id", function (req, res, next) {
  var logprodata = {
    id_Datos: req.params.id
  };
  // console.log(req.params);

  login_proceso.delData(logprodata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one login_proceso
router.post("/logpone/:id", function (req, res, next) {
  var logprodata = {
    id_Datos: req.params.id
  };
  login_proceso.idData(logprodata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get all login_proceso
router.get("/logpall", function (req, res, next) {
  var logprodata = {};
  login_proceso.allData(logprodata, function (error, data) {
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