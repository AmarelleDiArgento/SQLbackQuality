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
  INSERT INTO [Temporales].[dbo].[Procesos] ([codigo_proceso], [nombre_proceso], [Personalizado1], [Personalizado1_Valor])
  VALUES `
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    insert += `(${d.codigo_proceso}, '${d.nombre_proceso}', '${d.Personalizado1}', '${d.Personalizado2}')`
    insert += ((i + 1) < data.length) ? ',' : ';';
  }
  console.log(insert);

  return insert
};
let upd = (d) => {
  return `
  UPDATE [dbo].[Procesos]
  SET    [codigo_proceso] = ${d.codigo_proceso},
        ,[nombre_proceso] = '${d.nombre_proceso}',
        ,[Personalizado1] = '${d.Personalizado1}',
        ,[Personalizado1_Valor] = '${d.Personalizado2}',
  WHERE [id_Proceso] = ${d.id_Proceso};`;
}
let del = (d) => {
  return `
  DELETE FROM [Temporales].[dbo].[Procesos]
  WHERE [id_Proceso] = ${d.id_Proceso};
        `;
}
let one = (d) => {
  return `
  SELECT [id_Proceso], [codigo_proceso], [nombre_proceso], [Personalizado1], [Personalizado1_Valor]
  FROM [dbo].[Procesos]
  WHERE [id_Proceso] = ${d.id_Proceso};`;
}

let all = ` 
  SELECT [id_Proceso], [codigo_proceso], [nombre_proceso], [Personalizado1], [Personalizado1_Valor]
  FROM [dbo].[Procesos];`;

modProceso.insData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(ins(prodata),
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

modProceso.updData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(upd(prodata),
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

modProceso.delData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(del(prodata),
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

modProceso.idData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(one(prodata),
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

modProceso.proData = function (prodata, callback) {

  poolConnect;
  var request = new sql.Request(pool)
  request.query(log(prodata),
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

modProceso.allData = function (prodata, callback) {
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
module.exports = modProceso;