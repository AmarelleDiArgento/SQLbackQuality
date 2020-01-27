var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modDatosCal = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err):  console.log("...Conectado...");
})

let ins = (Dcpdata) => {
  return `INSERT INTO [dbo].[Datos_Calidad_Pos] ([id_proceso] ,[fecha] ,[Dato1] ,
  [Dato2] ,[Dato3] ,[Dato4] ,[Dato5] ,[Dato6] ,[Dato7] ,[Dato8] ,[Dato9])
  VALUES(${Dcpdata.id_proceso},'${Dcpdata.fecha}','${Dcpdata.Dato1}',
  '${Dcpdata.Dato2}','${Dcpdata.Dato3}','${Dcpdata.Dato4}','${Dcpdata.Dato5}',
  '${Dcpdata.Dato6}','${Dcpdata.Dato7}','${Dcpdata.Dato8}','${Dcpdata.Dato9}');`
};
let upd = (Dcpdata) => {
  return `UPDATE [dbo].[Datos_Calidad_Pos]
  SET [id_proceso] = ${Dcpdata.id_proceso}, [fecha] = '${Dcpdata.fecha}', [Dato1] = '${Dcpdata.Dato1}', [Dato2] = '${Dcpdata.Dato2}', 
  [Dato3] = '${Dcpdata.Dato3}', [Dato4] = '${Dcpdata.Dato4}', [Dato5] = '${Dcpdata.Dato5}', [Dato6] = '${Dcpdata.Dato6}', 
  [Dato7] = '${Dcpdata.Dato7}', [Dato8] = '${Dcpdata.Dato8}', [Dato9] = '${Dcpdata.Dato9}'
  WHERE [id_Datos] = ${Dcpdata.id_Datos};`;
}
let del = (Dcpdata) => {
  return `DELETE FROM [dbo].[Datos_Calidad_Pos]
  WHERE [id_Datos] = ${Dcpdata.id_Datos};`;
}
let one = (Dcpdata) => {
  return `SELECT [id_Datos] ,[id_proceso] ,[fecha] ,[Dato1] ,[Dato2] ,[Dato3] ,[Dato4] ,[Dato5] ,[Dato6] ,
  [Dato7] ,[Dato8] ,[Dato9]
  FROM [Formularios].[dbo].[Datos_Calidad_Pos]
  WHERE id_Datos = ${Dcpdata.id_Datos};`;
}
let log = (Dcpdata) => {
  return `SELECT [id_Datos] ,[id_proceso] ,[fecha] ,[Dato1] ,[Dato2] ,[Dato3] ,[Dato4] ,[Dato5] ,[Dato6] ,
  [Dato7] ,[Dato8] ,[Dato9]
  FROM [Formularios].[dbo].[Datos_Calidad_Pos]
  WHERE [id_proceso] = ${Dcpdata.id_proceso} AND [fecha] = '${Dcpdata.fecha}';`;
}
let all = `SELECT [id_Datos] ,[id_proceso] ,[fecha] ,[Dato1] ,[Dato2] ,[Dato3] ,[Dato4] ,[Dato5] ,[Dato6] ,
  [Dato7] ,[Dato8] ,[Dato9]
  FROM [Formularios].[dbo].[Datos_Calidad_Pos]`;

  modDatosCal.insData = function (Dcpdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(Dcpdata),
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

modDatosCal.updData = function (Dcpdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(Dcpdata),
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

modDatosCal.delData = function (Dcpdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(Dcpdata),
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

modDatosCal.idData = function (Dcpdata, callback) {

  poolConnect;
  // console.log('Data en modulo', Dcpdata)
  var request = new sql.Request(pool)
  request.query(one(Dcpdata),
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

modDatosCal.Dcpdata = function (Dcpdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(Dcpdata),
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

modDatosCal.allData = function (Dcpdata, callback) {
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
module.exports = modDatosCal;