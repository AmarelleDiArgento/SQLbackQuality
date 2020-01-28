var express = require("express");
var router = express.Router();

var Procesos_Detalle = require("../modules/Procesos_Detalle");

//insert data Procesos_Detalle
router.post("/Pdins", function (req, res, next) {

  var proData = req.body
  // console.log(proData);

  Procesos_Detalle.insData(prodetdata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update data Procesos_Detalle
router.put("/Pdupd/:id", function (req, res, next) {

  var prodetdata = {
    ...req.body
  };
  Procesos_Detalle.updData(prodetdata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get Procesos_Detalle user
router.post("/Procesos_Detalle", function (req, res, next) {
  var prodetdata = {
    id_usuario: req.body.id_usuario,
    password: req.body.password
  };
  Procesos_Detalle.prodetdata(prodetdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one Procesos_Detalle
router.delete("/Pddel/:id", function (req, res, next) {
  var prodetdata = {
    id_Datos: req.params.id
  };
  // console.log(req.params);

  Procesos_Detalle.delData(prodetdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one Procesos_Detalle
router.post("/Pdone/:id", function (req, res, next) {
  var prodetdata = {
    id_Datos: req.params.id
  };
  Procesos_Detalle.idData(prodetdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get all Procesos_Detalle
router.get("/Pdall", function (req, res, next) {
  var prodetdata = {};
  Procesos_Detalle.allData(prodetdata, function (error, data) {
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