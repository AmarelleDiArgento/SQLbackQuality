var express = require("express");
var router = express.Router();


var capturador = require("../modules/capturador");



//get all capturados
/**
 * Capturador, carga todos los formularios ejecutados en una fecha especifica
 */
router.post("/capallfec", function (req, res, next) {
    var capData = {
      ...req.body
    };
    capturador.capAllFec(capData, function (error, data) {
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