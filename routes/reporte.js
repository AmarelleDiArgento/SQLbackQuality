var express = require("express");
var router = express.Router();

var reporte = require("../modules/reporte");

//insert repData proin
router.get("/reptra", function (req, res, next) {

  var repData = [{formatoSql:"2021-01-07"},{formatoSql:"2021-01-09"}]
  // console.log(repData);

  reporte.repTrasf(repData, function (error, data) {
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