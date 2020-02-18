var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modProceso = {};


// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})

let ins = (prodata) => {
 return `
  INSERT INTO [Formularios].[dbo].[Procesos]([codigo_proceso], [nombre_proceso], [Personalizado1], [Personalizado2], [Personalizado3], [Personalizado4], [Personalizado5], [Personalizado1_Valor])
  VALUES('${prodata.codigo_proceso}', '${prodata.nombre_proceso}', '${prodata.Personalizado1}', '${prodata.Personalizado2}', '${prodata.Personalizado3}', '${prodata.Personalizado4}', '${prodata.Personalizado5}','${prodata.Personalizado1_Valor}');`
 
  // console.log(insert);

  // return insert
};
let upd = (prodata) => {
  console.log(prodata);
  
  return `
  UPDATE  [Formularios].[dbo].[Procesos]
  SET [codigo_proceso] = ${prodata.codigo_proceso}
     ,[nombre_proceso] = ' ${prodata.nombre_proceso}'
     ,[Personalizado1] = ' ${prodata.Personalizado1}'
     ,[Personalizado2] = ' ${prodata.Personalizado2}'
     ,[Personalizado3] = ' ${prodata.Personalizado3}'
     ,[Personalizado4] = ' ${prodata.Personalizado4}'
     ,[Personalizado5] = ' ${prodata.Personalizado5}'
     ,[Personalizado1_Valor] =  ${prodata.Personalizado1_Valor}
WHERE [id_Proceso] =  ${prodata.id_Proceso} ;`
}
let del = (prodata) => {
  return `
  DELETE FROM [Formularios].[dbo].[Procesos]
  WHERE [id_Proceso] = ${prodata.id_Proceso};
        `;
}
let one = (prodata) => {
  return `
  SELECT 
  [id_Proceso], 
  [codigo_proceso], 
  [nombre_proceso], 
  [Personalizado1], 
  [Personalizado2], 
  [Personalizado3], 
  [Personalizado4], 
  [Personalizado5],
  [Personalizado1_Valor]
  FROM [Formularios].[dbo].[Procesos]
  WHERE [codigo_proceso] = ${prodata.codigo_detalle};`;
}

let all = ` 
  SELECT [id_Proceso] ,[codigo_proceso] ,[nombre_proceso] ,[Personalizado1] ,[Personalizado2] ,[Personalizado3] ,[Personalizado4] ,[Personalizado5] ,[Personalizado1_Valor]
  FROM [Formularios].[dbo].[Procesos];`;


modProceso.insData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(prodata),
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

modProceso.updData = function (prodata, callback) {
  console.log(upd(prodata));
  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(prodata),
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

modProceso.delData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(prodata),
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

modProceso.idData = function (prodata, callback) {

  poolConnect;
  // console.log('Data en modulo', prodata)
  var request = new sql.Request(pool)
  request.query(one(prodata),
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

modProceso.prodata = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(prodata),
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

modProceso.allData = function (prodata, callback) {
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



module.exports = modProceso;