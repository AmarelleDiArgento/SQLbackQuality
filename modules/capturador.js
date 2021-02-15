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
        SELECT
        CONCAT(CONVERT(varchar,[fecha],12),CONVERT(varchar,[fecha],8),dpd.[id_procesos],[id_terminal],dpd.[id_usuario],[consec_json]) as unico, 
            dpd.fecha ,
            dpd.id_procesos,
        p.nombre_proceso,
        pd.codigo_detalle id_codigo,
        pd.nombre_detalle,
        dpd.[valor_resp_d], --id_
        dpd.rUsu_resp_d, --lugar
        dpd.[id_terminal], 
        dpd.id_usuario,
        l.nombre_usuario, 
        dpd.consec_json 
        INTO #Tabla_general
        FROM [Formularios].[dbo].[datos_procesos_detalle] dpd with(nolock)
            inner join [Formularios].[dbo].[Procesos_detalle] pd with(nolock) on dpd.id_procesos_detalle = pd.id_detalle
            inner join [Formularios].[dbo].[Procesos] p with(nolock) on dpd.id_procesos = p.codigo_proceso
            inner join [Formularios].[dbo].[login] l with(nolock) on dpd.id_usuario = l.id_usuario
        WHERE fecha between '${c.fIn} 00:00:00' and '${c.fFi} 23:59:59'
            ${condicion}
            and pd.tipo_M = 'H'
            and id_procesos <> 110
        ORDER BY fecha;
        
        SELECT 
            tg.unico, 
            tg.fecha ,
            tg.id_procesos,
            tg.nombre_proceso proceso,
            tg.id_codigo,
            tg.nombre_detalle,
            tg.[valor_resp_d] id_lugar,
            tg.rUsu_resp_d lugar,
            tg.[id_terminal], 
            tg.id_usuario,
            tg.nombre_usuario, 
            tg.consec_json ,
            (
                SELECT    tgJson.nombre_detalle llave,
                                tgJson.[rUsu_resp_d] valor
                FROM #Tabla_general tgJson
                WHERE fecha = fecha
                    and tgJson.id_usuario = tg.id_usuario
                    and tgJson.id_procesos = tg.id_procesos
                    and tgJson.id_terminal = tg.id_terminal
                    and tgJson.consec_json = tg.consec_json
            FOR JSON PATH
            ) Encabezado
        FROM #Tabla_general tg
        WHERE id_codigo = 1;

        DROP TABLE if exists #Tabla_general;`
};

let tmpForms = (form) => {
    // DELETE FROM [dbo].[datos_procesos_detalle]
    return `
  
  Select * FROM [dbo].[datos_procesos_detalle]
  WHERE id_datos_procesos_detalle in(
    SELECT dpd.id_datos_procesos_detalle as id
    FROM [Formularios].[dbo].[datos_procesos_detalle] dpd
    WHERE 
      [id_procesos]= ${form.id_procesos} and
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