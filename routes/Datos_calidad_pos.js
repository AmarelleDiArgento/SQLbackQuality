var express = require("express");
var router = express.Router();

var Datos_Calidad_Pos = require("../modules/Datos_Calidad_Pos");

//insert data Datos_Calidad_Pos
router.post("/Dcpins", function (req, res, next) {

  var proData = req.body
  // console.log(proData);

  Datos_Calidad_Pos.insData(Dcpdata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update data Datos_Calidad_Pos
router.put("/Dcpupd/:id", function (req, res, next) {

  var Dcpdata = {
    ...req.body
  };
  Datos_Calidad_Pos.updData(Dcpdata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get Datos_Calidad_Pos user
router.post("/Datos_Calidad_Pos", function (req, res, next) {
  var Dcpdata = {
    id_usuario: req.body.id_usuario,
    password: req.body.password
  };
  Datos_Calidad_Pos.Dcpdata(Dcpdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one Datos_Calidad_Pos
router.delete("/Dcpdel/:id", function (req, res, next) {
  var Dcpdata = {
    id_Datos: req.params.id
  };
  // console.log(req.params);

  Datos_Calidad_Pos.delData(Dcpdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one Datos_Calidad_Pos
router.post("/Dcpone/:id", function (req, res, next) {
  var Dcpdata = {
    id_Datos: req.params.id
  };
  Datos_Calidad_Pos.idData(Dcpdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get all Datos_Calidad_Pos
router.get("/Dcpall", function (req, res, next) {
  var Dcpdata = {};
  Datos_Calidad_Pos.allData(Dcpdata, function (error, data) {
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