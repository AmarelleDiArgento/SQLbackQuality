var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modGrafica = {};


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

let all = `
  SELECT fecha, Postcosecha, Area, nombre_proceso, Capitulo, Short_Item, item, Total_Si, Total_No
    FROM Formularios.dbo.Vista_Postco
    WHERE fecha between '2020-01-31 00:00:00' and '2020-02-01 23:59:59'
    ORDER BY Postcosecha, nombre_proceso;
`;

modGrafica.allData = function (logdata, callback) {
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

modGrafica.allDataTest = function (logdata, callback) {

  function texto() {
    return 'Hola :D'
  }


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