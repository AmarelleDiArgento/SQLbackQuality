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

let ins = (data) => {
  let insert = `
  INSERT INTO [Formularios].[dbo].[Procesos] ([codigo_proceso], [nombre_proceso], [Personalizado1], [Personalizado2], [Personalizado3], [Personalizado4], [Personalizado5], [Personalizado1_Valor])
  VALUES `
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    insert += `(${d.codigo_proceso}, '${d.nombre_proceso}', '${d.Personalizado1}', '${d.Personalizado2}', '${d.Personalizado3}', '${d.Personalizado4}', '${d.Personalizado5}', '${d.Personalizado1_Valor}')`
    insert += ((i + 1) < data.length) ? ',' : ';';
  }
  // console.log(insert);

  return insert
};
let upd = (d) => {
  return `
  UPDATE [dbo].[Procesos]
  SET    [codigo_proceso] = ${d.codigo_proceso},
        ,[nombre_proceso] = '${d.nombre_proceso}',
        ,[Personalizado1] = '${d.Personalizado1}',
        ,[Personalizado2] = '${d.Personalizado2}',
        ,[Personalizado3] = '${d.Personalizado3}',
        ,[Personalizado4] = '${d.Personalizado4}',
        ,[Personalizado5] = '${d.Personalizado5}',
        ,[Personalizado1_Valor] = '${d.Personalizado2}',
  WHERE [id_Proceso] = ${d.id_Proceso};`;
}
let del = (d) => {
  return `
  DELETE FROM [Formularios].[dbo].[Procesos]
  WHERE [id_Proceso] = ${d.id_Proceso};
        `;
}
let one = (d) => {
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
  FROM [dbo].[Procesos]
  WHERE [id_Proceso] = ${d.id_Proceso};`;
}

let all = ` 
  SELECT [id_Proceso] ,[codigo_proceso] ,[nombre_proceso] ,[Personalizado1] ,[Personalizado2] ,[Personalizado3] ,[Personalizado4] ,[Personalizado5] ,[Personalizado1_Valor]
  FROM [dbo].[Procesos];`;


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