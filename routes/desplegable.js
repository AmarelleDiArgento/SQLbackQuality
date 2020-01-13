var express = require("express");
var router = express.Router();

var desplegable = require("../modules/desplegable");
//get all desplegable
router.get("/desplegables", function (req, res, next) {
  var audiData = {};
  desplegable.allData(audiData, function (error, data) {
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