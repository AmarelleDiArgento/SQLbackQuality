var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modlogin_pro = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err):  console.log("...Conectado...");
})

let ins = (logprodata) => {
  return `INSERT INTO [Formularios].[dbo].[login_proceso] ([id_usuario] ,[id_procesos])
          VALUES(${logprodata.id_usuario},'${logprodata.id_procesos}');`
};
let upd = (logprodata) => {
  return `UPDATE [Formularios].[dbo].[login_proceso]
          SET [id_usuario] = ${logprodata.id_usuario}, [id_procesos] = '${logprodata.id_procesos}' 
          WHERE [id_login_proc] = ${logprodata.id_login_proc};`;
}
let del = (logprodata) => {
  return `DELETE FROM [Formularios].[dbo].[login_proceso]
          WHERE [id_login_proc] = ${logprodata.id_login_proc};`;
}
let one = (logprodata) => {
  return `SELECT [id_login_proc] ,[id_usuario] ,[id_procesos]
          FROM [Formularios].[dbo].[login_proceso]
          WHERE id_login_proc = ${logprodata.id_login_proc};`;
        }
let log = (logprodata) => {
  return `SELECT [id_login_proc] ,[id_usurio] ,[id_procesos]
          FROM [Formularios].[dbo].[login_proceso]
          WHERE [id_usuario] = ${logprodata.id_usuario} AND [id_procesos] = '${logprodata.id_procesos}';`;
}
let all = `SELECT [id_login_proc] ,[id_usuario] ,[id_procesos]
          FROM [Formularios].[dbo].[login_proceso]`;

  modlogin_pro.insData = function (logprodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(logprodata),
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

modlogin_pro.updData = function (logprodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(logprodata),
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

modlogin_pro.delData = function (logprodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(logprodata),
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

modlogin_pro.idData = function (logprodata, callback) {

  poolConnect;
  // console.log('Data en modulo', logprodata)
  var request = new sql.Request(pool)
  request.query(one(logprodata),
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

modlogin_pro.logprodata = function (logprodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(logprodata),
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

modlogin_pro.allData = function (logprodata, callback) {
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
module.exports = modlogin_pro;