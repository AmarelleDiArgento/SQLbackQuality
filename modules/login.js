var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modLogin = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err) : console.log("...Conectado...");
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
  return `
  SELECT l.id_usuario, l.nombre_usuario, l.Grupo1, l.Grupo2, l.Grupo3, p.nombre_permiso, p.url, p.estado 
  FROM Formularios.dbo.login l
  LEFT OUTER JOIN Formularios.dbo.login_permisos lp on l.id_login = lp.id_login
  FULL OUTER JOIN Formularios.dbo.Permisos p on lp.id_permiso = p.id_Permiso
  WHERE [id_usuario] = ${logdata.usuario} AND [password] = '${logdata.password}';`;
}


let logfull = (logdata) => {
  return `
  SELECT (
  SELECT 	usuario.id_login  as [key], usuario.id_usuario as [codigo], usuario.nombre_usuario as [nombre], usuario.Grupo1 as [g1], usuario.Grupo2  as [g2], usuario.Grupo3  as [g3], 
			modulos.id_modulo as [id], modulos.nombre_modulo as [nombre], 
			permisos.id_Permiso as [id], TRIM( permisos.nombre_permiso) as [nombre], permisos.url  as [url],
			reportes.id_reporte as [id], reportes.nombre_reporte as [reporte], reportes.url_reporte as [url], reportes.descripcion_reporte as [descripcion]
  FROM Formularios.dbo.login usuario 
      full outer  join Formularios.dbo.login_permisos  lp on usuario.id_login = lp.id_login 
      full outer join Formularios.dbo.Permisos permisos on lp.id_permiso = permisos.id_Permiso
      full outer join Formularios.dbo.reportes reportes on permisos.id_Permiso = reportes.id_permiso 
      full outer join Formularios.dbo.modulos modulos on permisos.id_modulo = modulos.id_modulo 
  WHERE [id_usuario] = ${logdata.usuario} AND [password] = '${logdata.password}'
  ORDER BY modulos.id_modulo 
  FOR JSON AUTO) DATA;`

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

modLogin.logallData = function (logdata, callback) {
  
  poolConnect;
  var request = new sql.Request(pool)
  request.query(logfull(logdata),
    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware Error
        callback(null, e.admError(error));
      } else {
        if (error) {
          // Manejo de error en el middleware utils
          callback(null, e.admError(error));
        } else {
          // convertir texto resultante de SQL JSON a JSON          
          callback(null, JSON.parse(rows.recordset[0].DATA))
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