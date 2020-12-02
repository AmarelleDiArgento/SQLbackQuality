var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")

var modCapturador = {};

// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})

let forms = (cap) => {

  let condicion = (cap.proc) ? ` and p.Personalizado3 like '%${cap.proc}%'` : '';

  return `
  SELECT CONCAT(CONVERT(varchar,[fecha],12),CONVERT(varchar,[fecha],8),dpd.[id_procesos],[id_terminal],dpd.[id_usuario],[consec_json]) as unico 
    ,[fecha], dpd.id_procesos id_proceso, p.nombre_proceso proceso, [valor_resp_d] id_lugar,
    [rUsu_resp_d] lugar ,dpd.[id_usuario], l.nombre_usuario, [consec_json]
  FROM [Formularios].[dbo].[datos_procesos_detalle] dpd
    inner join [Formularios].[dbo].[Procesos] p on dpd.id_procesos = p.codigo_proceso
    inner join [Formularios].[dbo].[login] l on dpd.id_usuario = l.id_usuario
  WHERE id_codigo = 1 and fecha between '${cap.fIn} 00:00:00' and '${cap.fFi} 23:59:59'
    ${condicion}
  ORDER BY  CONVERT(varchar,[fecha],12), l.nombre_usuario, p.nombre_proceso, [consec_json], [rUsu_resp_d]`

};


modCapturador.capAllFec = function (capData, callback) {

  poolConnect;
  console.log('Data en modulo', capData)
  console.log(forms(capData))
  var request = new sql.Request(pool)

  request.query(forms(capData),
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

// pool.close()
module.exports = modCapturador;