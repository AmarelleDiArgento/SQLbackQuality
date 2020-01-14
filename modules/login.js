var sql = require('mssql')
var config = require("../config");

var e = require("./error")
var modLogin = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})

let ins = (logdata) => {
  return `INSERT INTO [dbo].[login] ([id_usuario] ,[nombre_usuario] ,[password])
  VALUES(${logdata.id_usuario},'${logdata.nombre_usuario}','${logdata.password}');`
};
let upd = (logdata) => {
  return `UPDATE [dbo].[login]
  SET [id_usuario] = ${logdata.id_usuario}, [nombre_usuario] = '${logdata.nombre_usuario}', [password] = '${logdata.password}'
  WHERE [id_login] = ${logdata.id_login};`;
}
let del = (logdata) => {
  return `DELETE FROM [dbo].[login]
            WHERE [id_login] = ${logdata.id_login};`;
}
let one = (logdata) => {
  return `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]
            WHERE id_login = ${logdata.id_login};`;
}
let log = (logdata) => {
  return `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]
            WHERE [id_usuario] = ${logdata.id_usuario} AND [password] = '${logdata.password}';`;
}
let all = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
            FROM [Temporales].[dbo].[login]`;

modLogin.insData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(logdata),
    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware Error
        callback(null, e.admError(error));
      } else {
        console.log(rows);
        
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
};

modLogin.updData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(logdata),
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

};

modLogin.delData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(logdata),
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
};

modLogin.idData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(one(logdata),
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
};

modLogin.logData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(logdata),
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
};

modLogin.allData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
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
    });
};

// pool.close()
module.exports = modLogin;