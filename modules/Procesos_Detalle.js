var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modprodet = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err):  console.log("...Conectado...");
})

let ins = (prodetdata) => {
  return `INSERT INTO [Formularios].[dbo].[Procesos_Detalle]([id_proceso], [codigo_detalle], [nombre_detalle], [tipo],
          [lista_desp], [tipo_M], [porcentaje], [capitulo], [item], [Capitulo_Nombre], [grupo1])
          VALUES('${prodetdata.id_proceso}', '${prodetdata.codigo_detalle}', '${prodetdata.nombre_detalle}', '${prodetdata.tipo}',
          '${prodetdata.lista_desp}', '${prodetdata.tipo_M}', '${prodetdata.porcentaje}', '${prodetdata.capitulo}',
          '${prodetdata.item}','${prodetdata.Capitulo_Nombre}', '${prodetdata.grupo1}');`
}
let upd = (prodetdata) => {
  return `UPDATE [dbo].[Procesos_Detalle]
          SET [id_proceso] = ${prodetdata.id_proceso}, [codigo_detalle] = '${prodetdata.codigo_detalle}',
          [nombre_detalle] = ${prodetdata.nombre_detalle}, [tipo] = ${prodetdata.tipo}, [lista_desp] = '${prodetdata.lista_desp}',
          [tipo_M] = ${prodetdata.tipo_M}, [porcentaje] = ${prodetdata.porcentaje}, [capitulo] = ${prodetdata.capitulo},
          [item] = ${prodetdata.item}, [Capitulo_Nombre] = ${prodetdata.Capitulo_Nombre}, [grupo1] = ${prodetdata.grupo1}
          WHERE [id_detalle] = ${prodetdata.id_detalle};`;
}
let del = (prodetdata) => {
  return `DELETE FROM [dbo].[Procesos_Detalle]
          WHERE [id_detalle] = ${prodetdata.id_detalle};`;
}
let one = (prodetdata) => {
  return `SELECT [id_proceso] ,[codigo_detalle] ,[nombre_detalle], [tipo] ,
          [lista_desp] ,[tipo_M] ,[porcentaje] ,[capitulo] ,[item] ,[Capitulo_Nombre] ,[grupo1]
          FROM [Formularios].[dbo].[Procesos_Detalle]
          WHERE id_detalle = ${prodetdata.id_detalle};`;
        }

let fil = (prodetdata) => {
  return `SELECT [id_proceso] ,[codigo_detalle] ,[nombre_detalle], [tipo] ,
          [lista_desp] ,[tipo_M] ,[porcentaje] ,[capitulo] ,[item] ,[Capitulo_Nombre] ,[grupo1]
          FROM [Formularios].[dbo].[Procesos_Detalle]
          WHERE id_proceso = ${prodetdata.id_proceso};`;
          }
let log = (prodetdata) => {
  return `SELECT [id_detalle] ,[id_proceso] ,[codigo_detalle] ,[nombre_detalle], [tipo] ,
          [lista_desp] ,[tipo_M] ,[porcentaje] ,[capitulo] ,[item] ,[Capitulo_Nombre] ,[grupo1]
          FROM [Formularios].[dbo].[Procesos_Detalle]
          WHERE [id_proceso] = ${prodetdata.id_proceso} AND [codigo_detalle] = '${prodetdata.codigo_detalle}';`;
}
let all = `SELECT [id_proceso] ,[codigo_detalle] ,[nombre_detalle], [tipo] ,
          [lista_desp] ,[tipo_M] ,[porcentaje] ,[capitulo] ,[item] ,[Capitulo_Nombre] ,[grupo1]
          FROM [Formularios].[dbo].[Procesos_Detalle]`;

  modprodet.insData = function (prodetdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(prodetdata),
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

modprodet.updData = function (prodetdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(prodetdata),
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

modprodet.delData = function (prodetdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(prodetdata),
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

modprodet.idData = function (prodetdata, callback) {

  poolConnect;
  // console.log('Data en modulo', prodetdata)
  var request = new sql.Request(pool)
  request.query(one(prodetdata),
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

modprodet.idData = function (prodetdata, callback) {

  poolConnect;
  // console.log('Data en modulo', prodetdata)
  var request = new sql.Request(pool)
  request.query(fil(prodetdata),
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

modprodet.prodetdata = function (prodetdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(prodetdata),
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

modprodet.allData = function (prodetdata, callback) {
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
module.exports = modprodet;