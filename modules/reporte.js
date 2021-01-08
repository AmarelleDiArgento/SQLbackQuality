var sql = require('mssql')
var config = require("../config");

var e = require("../utils/utils")
var modReporte = {};


// async/await style:
const pool = new sql.ConnectionPool(config.jup10);
const poolConnect = pool.connect();

pool.on('error', err => {
  (error) ? e.admError(err): console.log("...Conectado...");
})




let trans = (fIn, fFi) => {
  return `
    CREATE TABLE #ResultadoTransferencias 
(
      [IdTransaccion] [int],
      [idOrdenDetalle] [int],
      [idOrdenTransferencia] [int] NULL,
      [idItem] [int] NULL,
      [PostCosechaOrigen] [varchar](100) NULL,
      [PostCosechaDestino] [varchar](100) NULL,
      [nomship] [char](60) NULL,
      [Estado] [varchar](20) NULL,
      [FechaTransferencia] [datetime] NULL,
      [ProductoMaestro] [varchar](100) NULL,
      [IdProducto] [smallint] NULL,
      [Producto] [varchar](50) NULL,
      [IDVariedad] [smallint] NULL,
      [Variedad] [varchar](50) NULL,
      [Color] [varchar](50) NULL,
      [TipoCorte] [varchar](50) NULL,
      [Marca] [varchar](200) NULL,
      [Grado] [varchar](50) NULL,
      [TallosPedidos] [int] NULL,
      [RamosPedido] [int] NULL,
      [RamosEmpaque] [int] NULL,
      [TallosEnviados] [int] NULL,
      [RamosEnviados] [int] NULL,
      [RamosEmpaqueEnviados] [int] NULL,
      [PostCosechaEnvia] [varchar](100) NULL,
      [SemanaEnvio] [int],
      [UsuarioEnvio] [varchar](50) NULL,
      [TallosRecibidos] [int] NULL,
      [Ramos] [int] NULL,
      [RamosEmpaqueRecibidos] [int] NULL,
      [PostCosechaRecibe] [varchar](100) NULL,
      [UsuarioRecibe] [varchar](50) NULL,
      [TallosPendientes] [int] NULL,
      [idTipoMovimiento] [varchar](10) NULL,
      [TipoOT] [varchar](10) NULL,
      [TipoEmpaque] [varchar](100) NULL,
      [Orden] [int],
      [Semana] [int],
      [FechaJornada] [datetime] NULL,
      [FechaLiberacion] [datetime] NULL,
      [FechaEnvioParcial] [datetime] NULL,
      [FechaEnvio] [datetime] NULL,
      [FechaRecibo] [datetime] NULL,
      [TotalTallosPed] [int] NULL,
      [ColorAgrupado] [varchar](50) NULL,
      [GradodeCalidad] [varchar](50) NULL,
      [UsuarioCrea] [varchar](50) NULL,
      [UsuarioLibera] [varchar](50) NULL
)
set nocount on;
insert into #ResultadoTransferencias exec [INV].[PA_ReporteOrdenesTransferenciaDetalle] 
      '${fIn}',
      '${fFi}',
      '1, 2, 3,131 ,342, 645, 681, 795, 917, 921, 925, 964, 965, 1000, 1001, 1027, 1055, 1061, 1065, 1066, 1068, 1159, 1160, 1161, 1162, 1168, 1170, 1183, 1191, 1192, 1193, 1196, 1197, 1198, 1199, 1200, 1202, 1203,1261,1407',
      '1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,28,32,33,35,36,37,38,39,40,41,42,43,44,45,46,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,97,98,99,100,110,111,113,153,159,180,182,184,185,204,270,342,555,562,572,578,579,580,581,582,583'
      select * into #ResultadoAuxiliar from #ResultadoTransferencias
      select ( 
            Select
            trans.[FechaJornada],
            trans.[idOrdenTransferencia],
            trans.[PostCosechaOrigen],
            trans.[PostCosechaDestino],
            OrdenTransferencia.[Producto],
            OrdenTransferencia.[Color],
            sum(OrdenTransferencia.[TallosPedidos]) [TallosPedidos],
            sum(OrdenTransferencia.[TallosPendientes]) [TallosPendientes],
            sum(OrdenTransferencia.[TallosEnviados]) [TallosEnviados]
      from #ResultadoTransferencias trans
            inner join #ResultadoAuxiliar OrdenTransferencia on trans.idOrdenTransferencia = OrdenTransferencia.idOrdenTransferencia
      group by trans.[FechaJornada],
            trans.[idOrdenTransferencia],
            trans.[PostCosechaOrigen],
            trans.[PostCosechaDestino],
            OrdenTransferencia.[Producto],
            OrdenTransferencia.[Color] 
      FOR JSON AUTO) doc

      DROP TABLE #ResultadoTransferencias;
      DROP TABLE #ResultadoAuxiliar;    
    `

};



modReporte.repTrasf = function (repData, callback) {
  poolConnect;
  var request = new sql.Request(pool)
  console.log(trans(repData[0].formatoSql, repData[1].formatoSql));

  request.query(trans(repData[0].formatoSql, repData[1].formatoSql),
    function (error, rows) {

      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        //callback(null, e.paqReturn(rows))
        rows = rows.recordset
        //console.log(rows[0].doc);
        callback(null, JSON.parse(rows[0].doc))

      }
    });
};

module.exports = modReporte;