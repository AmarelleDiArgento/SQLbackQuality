var sql = require('mssql'),
  config = require("../config");
//init pool mysql

var modeloDesplegable = {};

// const pool = new sql.ConnectionPool(config)

let ins = ``;
let upd = ``;
let del = ``;
let one = ``;
let log = ``;
let all = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]`;


modeloDesplegable.allData = function (desplegable, callback) {

  sql.connect(config.db, function (err) {
    if (err) console.log('Error: ', err);
    // create Request object
    var request = new sql.Request();
    request.query(all,
      function (error, rows) {
        if (error) {

          console.log(' ------------------------------------------------------------------------ ERROR ------------------------------------------------------------------------ \n', error.originalError.info, '\n ------------------------------------------------------------------------ ERROR ------------------------------------------------------------------------ \n ')
          callback(null, {
            respuesta: 'Error',
            error: {
              code: error.code,
              number: error.originalError.info.number,
              mensaje: error.originalError.info.message
            }

          });
        } else {
          if (rows.length != 0) {
            var jsonObj = {
              respuesta: 'Success',
              rows: rows.recordsets,
              output: rows.output,
              rowsAffected: rows.rowsAffected
            };
            callback(null, jsonObj);
          } else {
            callback(null, {
              respuesta: 'nodata',
              mensaje: 'La consulta no arroja datos.'
            });
          }
        }
      })
  });
};

// pool.close()
module.exports = modeloDesplegable;