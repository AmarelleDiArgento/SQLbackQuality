var express = require("express");
var router = express.Router();

var desplegable = require("../modules/desplegable");

//insert data login
router.post("/desins", function (req, res, next) {

  var desdata = req.body

  desplegable.insData(desdata, function (error, data) {
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

  var desdata = {
    ...req.body
  };
  desplegable.updData(desdata, function (error, data) {
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
  var desdata = {
    id_Desplegable: req.params.id
  };
  // console.log(req.params);

  desplegable.delData(desdata, function (error, data) {
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
  var desdata = {
    id_Desplegable: req.params.id
  };
    desplegable.idData(desdata, function (error, data) {
    if (error) {

      res.status(504).jsonp({
        error: error
      });
    } else {
      res.status(200).jsonp(data);
    }
  });
});

//get fil desplegable
router.post("/desfil/:id", function (req, res, next) {
  var desdata = {
    Filtro: req.params.id
  };
    desplegable.idData(desdata, function (error, data) {
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
  var desdata = {};
  desplegable.allData(desdata, function (error, data) {
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