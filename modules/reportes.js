var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modReporte = {};


// async/await style:
const pool = new sql.ConnectionPool(config.jup10);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})

/**
 * 
 * @param {*} fIn fecha inicial formato: yyyy-MM-dd
 * @param {*} fFi fecha final formato: yyyy-MM-dd 
 * 
 */
let tra = (fIn, fFi) => {
  return `
  Provider=SQLOLEDB.1;Integrated Security=SSPI;Persist Security Info=True;Initial Catalog=FDIM;Data Source=JUPITER10FCA;Use Procedure for Prepare=1;Auto Translate=True;Packet Size=4096;Workstation ID=DEVHESPINOSAC;Use Encryption for Data=False;Tag with column collation when possible=False

                                                             

  exec [INV].[PA_ReporteOrdenesTransferenciaDetalle] '20210103','20210105','1, 2, 3,131 ,342, 645, 681, 795, 917, 921, 925, 964, 965, 1000, 1001, 1027, 1055, 1061, 1065, 1066, 1068, 1159, 1160, 1161, 1162, 1168, 1170, 1183, 1191, 1192, 1193, 1196, 1197, 1198, 1199, 1200, 1202, 1203,1261,1407','1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,28,32,33,35,36,37,38,39,40,41,42,43,44,45,46,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,97,98,99,100,110,111,113,153,159,180,182,184,185,204,270,342,555,562,572,578,579,580,581,582,583'
      
      WHERE fecha between '${fIn} 00:00:00' and '${fFi} 23:59:59';
      `
};


modReporte.transferencias = function (repdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  let query = tra(logdata.ini, logdata.fin);
  console.log(query);
  request.query(query,
    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqReturn(rows))
      }
    });
};


module.exports = modReporte;