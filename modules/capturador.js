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
  let c = {
    fIn: cap[0].formatoSql, 
    fFi: cap[1].formatoSql,
    proc: cap.proc
  }

  let condicion = (c.proc) ? ` and p.Personalizado3 like '%${c.proc}%'` : '';

  return `
  SELECT CONCAT(CONVERT(varchar,[fecha],12),CONVERT(varchar,[fecha],8),dpd.[id_procesos],[id_terminal],dpd.[id_usuario],[consec_json]) as unico 
    ,[fecha], dpd.id_procesos id_proceso, p.nombre_proceso proceso, [valor_resp_d] id_lugar,
    [rUsu_resp_d] lugar ,dpd.[id_usuario], [id_terminal], l.nombre_usuario, [consec_json]
  FROM [Formularios].[dbo].[datos_procesos_detalle] dpd
    inner join [Formularios].[dbo].[Procesos] p on dpd.id_procesos = p.codigo_proceso
    inner join [Formularios].[dbo].[login] l on dpd.id_usuario = l.id_usuario
  WHERE id_codigo = 1 and fecha between '${c.fIn} 00:00:00' and '${c.fFi} 23:59:59'
    and dpd.[id_procesos] not int (110)
    ${condicion}
  ORDER BY  CONVERT(varchar,[fecha],12), l.nombre_usuario, p.nombre_proceso, [consec_json], [rUsu_resp_d]`

};

let tmpForms = (form) => {
  // DELETE FROM [dbo].[datos_procesos_detalle]
  return `
  
  Select * FROM [dbo].[datos_procesos_detalle]
  WHERE id_datos_procesos_detalle in(
    SELECT dpd.id_datos_procesos_detalle as id
    FROM [Formularios].[dbo].[datos_procesos_detalle] dpd
    WHERE 
      [id_procesos]= ${form.id_proceso} and
      [id_terminal] = '${form.id_terminal}' and
      [id_usuario] = ${form.id_usuario} and
      [consec_json] =  ${form.consec_json} and 
  CONCAT(CONVERT(varchar,[fecha],12),CONVERT(varchar,[fecha],8),dpd.[id_procesos],[id_terminal],dpd.[id_usuario],[consec_json]) = '${form.unico}')

`
}



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

modCapturador.capDelForm = function (capData, callback) {

  poolConnect;
  console.log('Data en modulo', capData)
  console.log(tmpForms(capData))
  var request = new sql.Request(pool)

  request.query(tmpForms(capData),
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