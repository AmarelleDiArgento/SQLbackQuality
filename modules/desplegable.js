var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modDesplegable = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})

let ins = (desdata) => {
  return `
          INSERT INTO [Formularios].[dbo].[Desplegables]([Filtro], [Codigo], [Opcion])
          VALUES('${desdata.Filtro}', '${desdata.Codigo}', '${desdata.Opcion}');`
};
let upd = (desdata) => {
  return `UPDATE [Formularios].[dbo].[Desplegables]
          SET [Filtro] = '${desdata.Filtro}', [Codigo] = '${desdata.Codigo}', [Opcion] = '${desdata.Opcion}'
          WHERE [id_Desplegable] = ${desdata.id_Desplegable};`;
}
let del = (desdata) => {
  return `DELETE FROM [Formularios].[dbo].[Desplegables]
          WHERE [id_Desplegable] = ${desdata.id_Desplegable};`;
}
let one = (desdata) => {
  return `SELECT [id_Desplegable] ,[Filtro] ,[Codigo] ,[Opcion]
          FROM [Formularios].[dbo].[Desplegables]
          WHERE id_Desplegable = ${desdata.id_Desplegable};`;
}
let fil = (desdata) => {
  return `SELECT [id_Desplegable] ,[Filtro] ,[Codigo] ,[Opcion]
          FROM [Formularios].[dbo].[Desplegables]
          WHERE Filtro = ${desdata.Filtro};`;
}
let log = (desdata) => {
  return `SELECT [id_Desplegable] ,[Filtro] ,[Codigo] ,[Opcion]
          FROM [Formularios].[dbo].[Desplegable]
          WHERE [Filtro] = ${desdata.Filtro} AND [Codigo] = '${desdata.Codigo}';`;
}
let all = `SELECT [id_Desplegable] ,[Filtro] ,[Codigo] ,[Opcion]
          FROM [Formularios].[dbo].[Desplegables]`;

modDesplegable.insData = function (desdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(desdata),
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

modDesplegable.updData = function (desdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(desdata),
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

modDesplegable.delData = function (desdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(desdata),
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

modDesplegable.idData = function (desdata, callback) {

  poolConnect;
  // console.log('Data en modulo', desdata)
  var request = new sql.Request(pool)
  request.query(one(desdata),
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
modDesplegable.Filtro = function (desdata, callback) {

  poolConnect;
  // console.log('Data en modulo', desdata)
  var request = new sql.Request(pool)
  request.query(fil(desdata),
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
modDesplegable.desdata = function (desdata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(desdata),
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

modDesplegable.allData = function (desdata, callback) {
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
module.exports = modDesplegable;