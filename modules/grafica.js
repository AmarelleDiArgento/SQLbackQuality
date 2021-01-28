var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modGrafica = {};

toSQLDateString = (date) => { // Formato SQL: 'yyyy-mm-dd'
  return `${date.getFullYear()}-${cero(date.getMonth() + 1)}-${cero(date.getDate())}`;
}

cero = (n) => {
  return (n < 10 ? '0' : '') + n;
}

var fecha = () => {
  let f = new Date();
  (f.getHours() >= 13) ? f.getDate(): f.setDate(f.getDate() - 1)
  return toSQLDateString(f)
}


var fechaPre = () => {
  let f = new Date();
  (f.getHours() >= 13) ? f.setDate(f.getDate() - 6): f.setDate(f.getDate() - 7)
  return toSQLDateString(f)
}

// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})

let Areas = `
  SELECT Area, SUM(Total_Si) as Si, SUM(Total_No) as No
    FROM Vista_Postco
    GROUP BY Area;`;

let Postcosechas = (postcosecha) => {
  return `
  SELECT Postcosecha, SUM(Total_Si) as Si, SUM(Total_No) as No 
    FROM Vista_Postco vp 
    WHERE AREA = '${postcosecha}'
    GROUP BY Postcosecha;`;
}


let Procesos = (area, postcosecha) => {
  return `
  SELECT nombre_proceso, SUM(Total_Si) as Si, SUM(Total_No) as No
    FROM Vista_Postco vp
    WHERE AREA = '${area}' AND Postcosecha = '${postcosecha}'  
    GROUP BY nombre_proceso;`;
}

let Capitulos = (area, postcosecha, proceso) => {
  return `
  SELECT Capitulo, SUM(Total_Si) as Si, SUM(Total_No) as No
    FROM Vista_Postco vp
    WHERE AREA = '${area}' AND Postcosecha = '${postcosecha}'  AND nombre_proceso = '${proceso}' 
    GROUP BY Capitulo;`;
}

let Shorts = (area, postcosecha, proceso, capitulo) => {
  return `
  SELECT Short_Item, SUM(Total_Si) as Si, SUM(Total_No) as No
    FROM Vista_Postco vp
    WHERE AREA = '${area}' AND Postcosecha = '${postcosecha}'  AND nombre_proceso = '${proceso}' AND Capitulo = '${capitulo}'
    GROUP BY Short_Item;`;
}

let Items = (area, postcosecha, proceso, capitulo, short) => {
  return `
  SELECT item, SUM(Total_Si) as Si, SUM(Total_No) as No
  FROM Vista_Postco vp
  WHERE AREA = '${area}' AND Postcosecha = '${postcosecha}'  AND nombre_proceso = '${proceso}' AND Capitulo = '${capitulo}' AND Short_Item = '${short}' 
  GROUP BY item;`;
}

let pos = (fIn, fFi) => {
  return `
  SELECT fecha, Postcosecha, Area, nombre_proceso, Capitulo, Short_Item, item, Total_Si, Total_No
    FROM Formularios.dbo.Vista_Postco
    WHERE fecha between '${fIn} 00:00:00' and '${fFi} 23:59:59'
    ORDER BY Postcosecha, nombre_proceso;
`
};


let cul = (fIn, fFi) => {
  return `
  SELECT [fecha],TRIM([Finca]) as Finca,[Area],[Supervisor],[nombre_proceso],[Capitulo],[Short_Item],[item],[Total_Si],[Total_No]
    FROM [Formularios].[dbo].[Vista_Cultivo]
    WHERE fecha between '${fIn} 00:00:00' and '${fFi} 23:59:59'
    ORDER BY TRIM(Finca), nombre_proceso;`
};


let pla = (fIn, fFi) => {
  return `
  SELECT TRIM([Finca]) as Finca, [Nave] as Area, TRIM([producto]) as Supervisor, TRIM(CONCAT([NombreBloque],[Sufijo])) as nombre_proceso, '' as Capitulo, [nombre_detalle] as Short_Item, [nombre_detalle] as item, [Total_Si], [Total_No]
    FROM [Formularios].[dbo].[vista_Aud_Siembra] 
    WHERE fecha between '${fIn} 00:00:00' and '${fFi} 23:59:59' and Finca IS NOT NULL
    ORDER BY TRIM(Finca), nombre_proceso;`
};


let mon = (fIn, fFi) => {
  return `
  SELECT [fecha], 
    TRIM([Finca]) as Finca,[Area],
    TRIM(dm.Producto) AS Supervisor,
    TRIM(dm.Variedad) AS Variedad,	
    CAST(CASE WHEN Formularios.dbo.removerCaracteresNoNumericos(bloque)>9 
      THEN CONCAT('BL ', Formularios.dbo.removerCaracteresNoNumericos(bloque))  
      ELSE CONCAT('BL 0', Formularios.dbo.removerCaracteresNoNumericos(bloque)) END AS nvarchar) as nombre_proceso,
    '' as Capitulo,[Short_Item],[item],
    CAST(CASE WHEN Resp = 'SI CUMPLE' THEN PONDERADO ELSE 0 END AS int) as [Total_Si],
    CAST(CASE WHEN Resp = 'NO CUMPLE' THEN PONDERADO ELSE 0 END AS int) as [Total_No]
  FROM [Formularios].[dbo].[Vista_Cultivo_Mercedes] dm
  WHERE fecha between '${fIn} 00:00:00' and '${fFi} 23:59:59'
  ORDER BY [fecha],Finca,[Area],[Variedad], [Bloque];
  `
};




let exp = (fIn, fFi) => {
  return `
          /* crea la temporal */
          CREATE TABLE ##tempData
          (
            Postcosecha varchar(max),
            Dia date,
            Asegurador varchar(max),
            Hora int,
            Proceso varchar(max),
            Aseguramientos int
          )
          /* Alimenta la temporal con los datos por hora asegurador, proceso, dia x dia segun el rango de seleccion */
          INSERT INTO ##tempData SELECT
            [valor_resp_d] as Postcosecha,
            CONVERT(DATE, [fecha]) as Dia,
            UPPER([nombre_usuario]) as Asegurador,
            datepart(hour, [fecha]) as Hora,
            [nombre_proceso] as Proceso,
            count([id_usuario]) as Aseguramientos
          FROM [Formularios].[dbo].[Postco_cab_Act]
          Where
            [fecha] between '${fIn} 00:00:00'
            and '${fFi} 23:59:59'
          GROUP BY
            [valor_resp_d],
            CONVERT(DATE, [fecha]),
            [nombre_usuario],
            datepart(hour, [fecha]),
            [nombre_proceso]
          ORDER BY
            [valor_resp_d],
            CONVERT(DATE, [fecha]),
            [nombre_usuario],
            datepart(hour, [fecha]),
            [nombre_proceso];
            /* media geometrica, promedio y variacion estandard por proceso */
          select
            Proceso,
            exp(sum(log(Aseguramientos)) / count(*)) as media_geo,
            STDEVP(Aseguramientos) var_sta,
            AVG(Aseguramientos) prom
          from ##tempData
          group by
            Proceso;
            /* Media geometrica y horas de actividad por asegurador */
          Select
            Postcosecha,
            Dia,
            Asegurador,
            Proceso,
            exp(sum(log(Aseguramientos)) / count(*)) as media_geo,
            count(*) horas_act
          from ##tempData
          group by
            Postcosecha,
            Dia,
            Asegurador,
            Proceso;
            /* Toda la data optenida */
          select
            *
          from ##tempData;
            /* Borra la temporal */
            drop table ##tempData;

  `
}

modGrafica.posData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(pos(logdata[0].formatoSql, logdata[1].formatoSql));

  request.query(pos(logdata[0].formatoSql, logdata[1].formatoSql),
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

modGrafica.culData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(cul(logdata[0].formatoSql, logdata[1].formatoSql));

  request.query(cul(logdata[0].formatoSql, logdata[1].formatoSql),
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

modGrafica.plaData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(pla(logdata[0].formatoSql, logdata[1].formatoSql));

  request.query(pla(logdata[0].formatoSql, logdata[1].formatoSql),
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

modGrafica.monData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(mon(logdata[0].formatoSql, logdata[1].formatoSql));

  request.query(mon(logdata[0].formatoSql, logdata[1].formatoSql),
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

modGrafica.expData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(all);
  console.log(exp(logdata.ini, logdata.fin));
  request.query(exp(logdata.ini, logdata.fin),
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


modGrafica.asegData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(all);

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

modGrafica.allDataTest = function (logdata, callback) {



  function dataAreas() {

    let are = []
    poolConnect;
    var request = new sql.Request(pool)
    request.query(Areas,
      function (error, rows) {
        // console.log('Entro a Areas');

        if (!error) {
          // console.log(error);
          return null;
        } else {
          let i = 0;
          for (const a of rows.recordset) {
            console.log(i++);

            are.push({
              Area: a.Area,
              postcosechas: [dataPostcosechas(a.Area)],
              Cumple: a.Si,
              NoCumple: a.No
            })
          }
        }
      });
    console.log('Datos de: ');

    console.log(are);

    return are
  }


  function dataPostcosechas(area) {
    poolConnect;
    var request = new sql.Request(pool)
    request.query(Postcosechas(area),
      function (error, rows) {
        // console.log('Entro a Postcosechas');

        if (error) {
          // console.log(error);

          return null;
        } else {
          // console.log(rows.recordset);

          let pos = []
          for (const p of rows.recordset) {
            pos.push({
              postcosecha: p.Postcosecha,
              Cumple: p.Si,
              NoCumple: p.No
            })
          }
          console.log(pos);
          return pos
        }
      });
  }

  function dataProcesos(area, postcosecha) {
    poolConnect;
    var request = new sql.Request(pool)
    request.query(Procesos(area, postcosecha),
      function (error, rows) {

        if (error) {
          // console.log(error);

          return null;
        } else {
          // console.log(rows.recordset);

          data = []
          for (const p of rows.recordset) {
            data.push({
              proceso: p.nombre_proceso,
              Capitulos: dataCapitulos(area, postcosecha, p.nombre_proceso),
              Cumple: p.Si,
              NoCumple: p.No
            })
          }
          return data
        }
      });
  }

  function dataCapitulos(area, postcosecha, proceso) {
    poolConnect;
    var request = new sql.Request(pool)
    request.query(Capitulos(area, postcosecha, proceso),
      function (error, rows) {

        if (error) {
          // console.log(error);

          return null;
        } else {
          // console.log(rows.recordset);

          data = []
          for (const p of rows.recordset) {
            data.push({
              capitulo: p.Capitulo,
              Shorts: dataShorts(area, postcosecha, proceso, p.Capitulo),
              Cumple: p.Si,
              NoCumple: p.No
            })
          }
          console.log(data);
          return data
        }
      });
  }


  function dataShorts(area, postcosecha, proceso, capitulo) {
    poolConnect;
    var request = new sql.Request(pool)
    request.query(Shorts(area, postcosecha, proceso, capitulo),
      function (error, rows) {

        if (error) {
          // console.log(error);

          return null;
        } else {
          // console.log(rows.recordset);

          data = []
          for (const p of rows.recordset) {
            data.push({
              short: p.Short_Item,
              Items: dataItems(area, postcosecha, proceso, capitulo, p.Short_Item),
              Cumple: p.Si,
              NoCumple: p.No
            })
          }
          return data
        }
      });
  }


  function dataItems(area, postcosecha, proceso, capitulo, short) {
    poolConnect;
    var request = new sql.Request(pool)
    request.query(Items(area, postcosecha, proceso, capitulo, short),
      function (error, rows) {

        if (error) {
          // console.log(error);

          return null;
        } else {
          // console.log(rows.recordset);

          data = []
          for (const p of rows.recordset) {
            data.push({
              item: p.item,
              Cumple: p.Si,
              NoCumple: p.No
            })
          }
          return data
        }
      });

  }

  // pool.close()
}

module.exports = modGrafica;