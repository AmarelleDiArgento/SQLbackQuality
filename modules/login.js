var sql = require('mssql')
var config = require("../config");

var e = require("./error")
var modLogin = {};

const pool = new sql.ConnectionPool(config.db)

let ins = ``;
let upd = ``;
let del = ``;
let one = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]
            WHERE id_login = ?;`;
let log = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]
            WHERE id_usuario = ? AND password = ?;`;
let all = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]`;

console.log(config.db);

modLogin.insData = function (desplegable, callback) {

  sql.connect(config.db, function (err) {
    if (err) console.log('Error: ', err);


    // create Request object
    var request = new sql.Request();
    request.query(upd, [
        desplegable.id_usuario,
        desplegable.nombre_usuario,
        desplegable.password,
      ],
      function (error, rows) {
        if (error) {
          // Manejo de error en el middleware Error
          callback(null, e.admError(error));
        } else {
          if (rows.length != 0) {
            var jsonObj = {
              respuesta: 'success',
              rows: rows.recordsets,
              output: rows.output,
              rowsAffected: rows.rowsAffected
            };
            callback(null, jsonObj);
          } else {
            callback(null, {
              respuesta: 'noData',
              mensaje: 'La consulta no arroja datos.'
            });
          }
        }
      })
  });
};

modLogin.updData = function (desplegable, callback) {

  sql.connect(config.db, function (error) {
    if (error) {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));
    } else {
      // create Request object
      var request = new sql.Request();
      request.query(upd, [
          desplegable.id_login,
          desplegable.id_usuario,
          desplegable.nombre_usuario,
          desplegable.password,
        ],
        function (error, rows) {
          if (error) {
            // Manejo de error en el middleware Error
            callback(null, e.admError(error));
          } else {
            if (rows.length != 0) {
              var jsonObj = {
                respuesta: 'success',
                rows: rows.recordsets,
                output: rows.output,
                rowsAffected: rows.rowsAffected
              };
              callback(null, jsonObj);
            } else {
              callback(null, {
                respuesta: 'noData',
                mensaje: 'La consulta no arroja datos.'
              });
            }
          }
        })
    }
  });
};

modLogin.delData = function (desplegable, callback) {

  sql.connect(config.db, function (error) {
    if (error) {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));

    } else {
      // create Request object
      var request = new sql.Request();
      request.query(del, [desplegable.id_login],
        function (error, rows) {
          if (error) {

            // Manejo de error en el middleware Error
            callback(null, e.admError(error));
          } else {
            if (rows.length != 0) {
              var jsonObj = {
                respuesta: 'success',
                rows: rows.recordsets,
                output: rows.output,
                rowsAffected: rows.rowsAffected
              };
              callback(null, jsonObj);
            } else {
              callback(null, {
                respuesta: 'noData',
                mensaje: 'La consulta no arroja datos.'
              });
            }
          }
        })
    }
  });
};

modLogin.idData = function (desplegable, callback) {

  sql.connect(config.db, function (err) {
    if (!error) {
      // create Request object
      var request = new sql.Request();
      request.query(one, [desplegable.id_login],
        function (error, rows) {
          if (error) {
            // Manejo de error en el middleware Error
            callback(null, e.admError(error));
          } else {
            if (rows.length != 0) {
              var jsonObj = {
                respuesta: 'success',
                rows: rows.recordsets,
                output: rows.output,
                rowsAffected: rows.rowsAffected
              };
              callback(null, jsonObj);
            } else {
              callback(null, {
                respuesta: 'noData',
                mensaje: 'La consulta no arroja datos.'
              });
            }
          }
        })

    } else {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));
    }
  });
};

modLogin.logData = function (desplegable, callback) {
  sql.connect(config.db, function (error) {
    if (!error) {
      // create Request object
      var request = new sql.Request();
      request.query(log, [
          desplegable.id_usuario,
          desplegable.password
        ],
        function (error, rows) {
          if (error) {
            // Manejo de error en el middleware Error
            callback(null, e.admError(error));
          } else {
            if (rows.length != 0) {
              var jsonObj = {
                respuesta: 'success',
                rows: rows.recordsets,
                output: rows.output,
                rowsAffected: rows.rowsAffected
              };
              callback(null, jsonObj);
            } else {
              callback(null, {
                respuesta: 'noData',
                mensaje: 'La consulta no arroja datos.'
              });
            }
          }
        })

    } else {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));

    }
  });
};

modLogin.allData = function (desplegable, callback) {

  sql.connect(config.db, function (error) {
    console.log('Conexion: ' + JSON.stringify(sql.connect()));
    if (error) {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));
    } else {

      // create Request object
      var request = new sql.Request();
      request.query(all,
        function (error, rows) {
          if (error) {
            // Manejo de error en el middleware Error
            callback(null, e.admError(error));
          } else {
            if (rows.length != 0) {
              var jsonObj = {
                respuesta: 'success',
                rows: rows.recordsets,
                output: rows.output,
                rowsAffected: rows.rowsAffected
              };
              callback(null, jsonObj);
            } else {
              callback(null, {
                respuesta: 'noData',
                mensaje: 'La consulta no arroja datos.'
              });
            }
          }
        })
    }
  });
};

// pool.close()
module.exports = modLogin;