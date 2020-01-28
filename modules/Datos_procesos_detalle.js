var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modDatospro = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err):  console.log("...Conectado...");
})

let ins = (Dpddata) => {
  return `INSERT INTO [dbo].[datos_procesos_detalle] ([fecha] ,[id_procesos] ,[id_procesos_detalle] ,
          [valor_resp_d] ,[porc_resp_d] ,[id_terminal] ,[id_usuario] ,[consec_json])
          VALUES(${Dpddata.fecha},'${Dpddata.id_procesos}','${Dpddata.id_procesos_detalle}',
          '${Dpddata.valor_resp_d}','${Dpddata.porc_resp_d}','${Dpddata.id_terminal}','${Dpddata.id_usuario}',
          '${Dpddata.consec_json}');`
};
let upd = (Dpddata) => {
  return `UPDATE [dbo].[datos_procesos_detalle]
          SET [id_procesos] = ${Dpddata.id_proceso}, [fecha] = '${Dpddata.fecha}', [id_procesos_detalle] = '${Dpddata.id_procesos_detalle}', [valor_resp_d] = '${Dpddata.valor_resp_d}', 
          [porc_resp_d] = '${Dpddata.porc_resp_d}', [id_terminal] = '${Dpddata.id_terminal}', [id_usuario] = '${Dpddata.id_usuario}', [consec_json] = '${Dpddata.consec_json}', 
          WHERE [id_datos_procesos_detalle] = ${Dpddata.id_datos_procesos_detalle};`;
}
let del = (Dpddata) => {
  return `DELETE FROM [dbo].[datos_procesos_detalle]
          WHERE [id_datos_procesos_detalle] = ${Dpddata.id_datos_procesos_detalle};`;
}
let one = (Dpddata) => {
  return `SELECT [id_datos_procesos_detalle] ,[fecha] ,[id_procesos] ,[id_procesos_detalle] ,
          [valor_resp_d] ,[porc_resp_d] ,[id_terminal] ,[id_usuario] ,[consec_json]
          FROM [Formularios].[dbo].[datos_procesos_detalle]
          WHERE id_datos_procesos_detalle = ${Dpddata.id_datos_procesos_detalle};`;
}
let log = (Dpddata) => {
  return `SELECT [id_datos_procesos_detalle] ,[fecha] ,[id_procesos] ,[id_procesos_detalle] ,
          [valor_resp_d] ,[porc_resp_d] ,[id_terminal] ,[id_usuario] ,[consec_json]
          FROM [Formularios].[dbo].[datos_procesos_detalle]
          WHERE [id_procesos] = ${Dpddata.id_procesos} AND [fecha] = '${Dpddata.fecha}';`;
}
let all = `SELECT [id_datos_procesos_detalle] ,[fecha] ,[id_procesos] ,[id_procesos_detalle] ,
          [valor_resp_d] ,[porc_resp_d] ,[id_terminal] ,[id_usuario] ,[consec_json]
          FROM [Formularios].[dbo].[datos_procesos_detalle]`;

  modDatospro.insData = function (Dpddata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(Dpddata),
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

modDatospro.updData = function (Dpddata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(Dpddata),
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

modDatospro.delData = function (Dpddata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(Dpddata),
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

modDatospro.idData = function (Dpddata, callback) {

  poolConnect;
  // console.log('Data en modulo', Dpddata)
  var request = new sql.Request(pool)
  request.query(one(Dpddata),
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

modDatospro.Dpddata = function (Dpddata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(Dpddata),
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

modDatospro.allData = function (Dpddata, callback) {
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
module.exports = modDatospro;