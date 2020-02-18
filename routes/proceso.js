var express = require("express");
var router = express.Router();

var proceso = require("../modules/proceso");

//insert prodata proin
router.post("/proins", function (req, res, next) {

  var prodata = req.body
  // console.log(proData);

  proceso.insData(prodata, function (error, data) {
    if (error) {
      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//update prodata proin
router.put("/proupd/:id", function (req, res, next) {

  var prodata = {
    id_Proceso: req.params.id,
    ...req.body
  };
  console.log(prodata);
  
  proceso.updData(prodata, function (error, data) {
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
router.delete("/prodel/:id", function (req, res, next) {

  var prodata = {
    id_Proceso: req.params.id
  };
  // console.log(req.params);

  proceso.delData(prodata, function (error, data) {
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
router.post("/proone/:id", function (req, res, next) {
  var prodata = {
    codigo_detalle: req.params.id
  };
  proceso.idData(prodata, function (error, data) {
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
  var prodata = {};
  proceso.allData(prodata, function (error, data) {
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