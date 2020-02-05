var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modLogin = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err):  console.log("...Conectado...");
})

let ins = (logdata) => {
  console.log(logdata);
  
  return `INSERT INTO [Formularios].[dbo].[login] ([id_usuario] ,[nombre_usuario] ,[password])
          VALUES(${logdata.id_usuario},'${logdata.nombre_usuario}','${logdata.id_usuario}');`

};
let upd = (logdata) => {
  return `UPDATE [Formularios].[dbo].[login]
          SET [id_usuario] = ${logdata.id_usuario}, [nombre_usuario] = '${logdata.nombre_usuario}', [password] = '${logdata.password}'
          WHERE [id_login] = ${logdata.id_login};`;
}
let del = (logdata) => {
  return `DELETE FROM [Formularios].[dbo].[login]
          WHERE [id_login] = ${logdata.id_login};`;
}
let one = (logdata) => {
  return `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
          FROM [Formularios].[dbo].[login]
          WHERE id_login = ${logdata.id_login};`;
}
let log = (logdata) => {
  return `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
          FROM [Formularios].[dbo].[login]
          WHERE [id_usuario] = ${logdata.id_usuario} AND [password] = '${logdata.password}';`;
}
let all = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password]
          FROM [Formularios].[dbo].[login]`;

modLogin.insData = function (logdata, callback) {

  console.log(ins(logdata));
  
  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(logdata),

    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqNoReturn('creado', rows))
      }
    })
};

modLogin.updData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(logdata),
    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqNoReturn('actualizado', rows))
      }
    })

};

modLogin.delData = function (logdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(logdata),
    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqNoReturn('eliminado', rows))
      }
    })
};

modLogin.idData = function (logdata, callback) {

  poolConnect;
  // console.log('Data en modulo', logdata)
  var request = new sql.Request(pool)
  request.query(one(logdata),
    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqReturn(rows))
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
        if (error) {
          // Manejo de error en el middleware utils
          callback(null, e.admError(error));
        } else {
          // Empaquetado de resultados en el middleware utils
          callback(null, e.paqReturn(rows))
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
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqReturn(rows))
      }
    });
};

// pool.close()
module.exports = modLogin;