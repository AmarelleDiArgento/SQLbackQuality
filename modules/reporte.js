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
	--	'${fIn}',
	-- 	'${fFi}',
	DECLARE @Inicio Date;
	DECLARE @Fin Date;
	Set @Inicio = getDate() -1
	Set @Fin = getDate() + 1 
	DROP TABLE IF EXISTS #ResultadoTransferencias;
		CREATE TABLE #ResultadoTransferencias 
		(
			[idOrdenDetalle] [int] NULL,
			[idOrdenTransferencia] [int] NOT NULL,
			[idItem] [int] NOT NULL,
			[PostCosechaOrigen] [varchar](100) NULL,
			[idPostCosechaOrigen] [int] NULL,
			[PostCosechaDestino] [varchar](100) NULL,
			[idPostCosechaDestino] [int] NULL,
			[nomship] [varchar](60) NULL,
			[Estado] [varchar](20) NULL,
			[FechaTransferencia] [datetime] NOT NULL,
			[ProductoMaestro] [varchar](100) NULL,
			[IDProductoMaestro] [int] NULL,
			[IdProducto] [int] NOT NULL,
			[Producto] [varchar](50) NULL,
			[IDVariedad] [int] NOT NULL,
			[Variedad] [varchar](50) NULL,
			[Color] [varchar](50) NULL,
			[idColor] [int] NULL,
			[TipoCorte] [varchar](50) NULL,
			[idTipoCorte] [int] NULL,
			[Marca] [varchar](200) NULL,
			[idMarca] [int] NULL,
			[Grado] [varchar](50) NULL,
			[idGrado] [int] NULL,
			[TallosPedidos] [int] NOT NULL,
			[RamosPedido] [int] NOT NULL,
			[RamosEmpaque] [int] NOT NULL,
			[TallosEnviados] [int] NOT NULL,
			[RamosEnviados] [int] NOT NULL,
			[RamosEmpaqueEnviados] [int] NOT NULL,
			[PostCosechaEnvia] [varchar](100) NULL,
			[SemanaEnvio] [real] NULL,
			[UsuarioEnvia] [varchar](20) NULL,
			[TallosRecibidos] [int] NOT NULL,
			[RamosRecibidos] [int] NOT NULL,
			[RamosEmpaqueRecibidos] [int] NOT NULL,
			[PostCosechaRecibe] [varchar](100) NULL,
			[UsuarioRecibe] [varchar](20) NULL,
			[TallosPendientes] [int] NULL,
			[IdTipoMovimiento] [varchar](3) NULL,
			[TipoOT] [varchar](6) NULL,
			[TipoEmpaque] [varchar](20) NULL,
			[Orden] [int] NULL,
			[Semana] [real] NULL,
			[FechaJornada] [smalldatetime] NULL,
			[FechaLiberacion] [smalldatetime] NULL,
			[FechaEnvioParcial] [smalldatetime] NULL,
			[FechaEnvio] [smalldatetime] NULL,
			[FechaRecibo] [smalldatetime] NULL,
			[TotalTallosPed] [int] NULL,
			[ColorAgrupado] [varchar](150) NULL,
			[GradodeCalidad] [varchar](150) NULL,
			[UsuarioCrea] [varchar](150) NULL,
			[UsuarioLibera] [varchar](150) NULL,
			[TallosProcesados] [int] NULL,
			[RamosProcesados] [int] NOT NULL,
			[idGradoMaestro] [int] NULL,
			[idColorAgrupado] [int] NULL,
			[IdEmpresa] [int] NOT NULL
		)
	SET NOCOUNT ON;
	INSERT INTO #ResultadoTransferencias EXEC [INV].[PA_ReporteOrdenesTransferenciaDetalle] 
		@Inicio,
		@Fin,
		'1, 2, 3,131 ,342, 645, 681, 795, 917, 921, 925, 964, 965, 1000, 1001, 1027, 1055, 1061, 1065, 1066, 1068, 1159, 1160, 1161, 1162, 1168, 1170, 1183, 1191, 1192, 1193, 1196, 1197, 1198, 1199, 1200, 1202, 1203,1261,1407',
		'1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,28,32,33,35,36,37,38,39,40,41,42,43,44,45,46,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,97,98,99,100,110,111,113,153,159,180,182,184,185,204,270,342,555,562,572,578,579,580,581,582,583'
	SELECT (
			SELECT CAST([FechaJornada] as Date) as Fecha,
				[idOrdenTransferencia] as OT,
				[PostCosechaOrigen] as Origen,
				[PostCosechaDestino] as Destino,
				[Producto],
				[Color],
				sum([TallosPedidos]) as [Tallos Pedidos],
				sum([TallosPendientes]) as [Tallos Pendientes],
				sum([TallosEnviados]) as [Tallos Enviados]
			FROM #ResultadoTransferencias 
			GROUP BY [FechaJornada],
				[idOrdenTransferencia],
				[PostCosechaOrigen],
				[PostCosechaDestino],
				[Producto],
				[Color]
			HAVING sum([TallosPendientes]) > 0 FOR JSON AUTO
		) doc DROP TABLE IF EXISTS #ResultadoTransferencias;
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
				data = {
					data:  JSON.parse(rows[0].doc)
				}
				callback(null, data)

			}
		});
};

module.exports = modReporte;