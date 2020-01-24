var express = require("express");
var router = express.Router();

var proceso = require("../modules/proceso");

//insert data proin
router.post("/proins", function (req, res, next) {

  var proData = req.body
  // console.log(proData);

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
router.put("/proupd/:id", function (req, res, next) {

  var logData = {
    ...req.body
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

//get one proin
router.delete("/prodel/:id", function (req, res, next) {

  var proData = {
    id_Proceso: req.params.id
  };
  // console.log(req.params);

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
router.post("/proone/:id", function (req, res, next) {
  var proData = {
    id_Proceso: req.params.id
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