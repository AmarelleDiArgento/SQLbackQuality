var express = require("express");
var router = express.Router();

var proceso = require("../modules/proceso");


function empaquetar(paquete){
  data = []
  for (const p of paquete) {
    data.push({
      codigo_proceso: p.codigo_proceso,
      nombre_proceso: p.nombre_proceso,
      Personalizado1: p.Personalizado1,
      Personalizado2: p.Personalizado2
    })
  } 
  return data
}
//insert data proin
router.post("/proins", function (req, res, next) {
   
  var proData = empaquetar(req.body)
  console.log(proData);

  proceso.insData(proData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update data proin
router.post("/proupd", function (req, res, next) {
  var proData = {
    id_usuario: req.body.id_usuario,
    nombre_usuario: req.body.nombre_usuario,
    password: req.body.password,
    id_proin: req.body.id_proin

  };
  proceso.updData(proData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get proin user
router.post("/proins", function (req, res, next) {
  var proData = {
    id_usuario: req.body.id_usuario,
    password: req.body.password
  };
  proceso.proData(proData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get one proin
router.post("/prodel", function (req, res, next) {
  var proData = {
    id_proin: req.body.id_proin
  };
  proceso.delData(proData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});
//get one proin
router.post("/proone", function (req, res, next) {
  var proData = {
    id_proin: req.body.id_proin
  };
  proceso.idData(proData, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get all proin
router.get("/proall", function (req, res, next) {
  var proData = {};
  proceso.allData(proData, function (error, data) {
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