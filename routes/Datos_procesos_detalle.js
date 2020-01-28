var express = require("express");
var router = express.Router();

var Datos_procesos_detalle = require("../modules/Datos_procesos_detalle");

//insert data Datos_procesos_detalle
router.post("/Dpdins", function (req, res, next) {

  var proData = req.body
  // console.log(proData);

  Datos_procesos_detalle.insData(Dpddata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update data Datos_procesos_detalle
router.put("/Dpdupd/:id", function (req, res, next) {

  var Dpddata = {
    ...req.body
  };
  Datos_procesos_detalle.updData(Dpddata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get Datos_procesos_detalle user
router.post("/Datos_procesos_detalle", function (req, res, next) {
  var Dpddata = {
    id_usuario: req.body.id_usuario,
    password: req.body.password
  };
  Datos_procesos_detalle.Dpddata(Dpddata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one Datos_procesos_detalle
router.delete("/Dpddel/:id", function (req, res, next) {
  var Dpddata = {
    id_Datos: req.params.id
  };
  // console.log(req.params);

  Datos_procesos_detalle.delData(Dpddata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one Datos_procesos_detalle
router.post("/Dpdone/:id", function (req, res, next) {
  var Dpddata = {
    id_Datos: req.params.id
  };
  Datos_procesos_detalle.idData(Dpddata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get all Datos_procesos_detalle
router.get("/Dpdall", function (req, res, next) {
  var Dpddata = {};
  Datos_procesos_detalle.allData(Dpddata, function (error, data) {
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