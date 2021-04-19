var sql = require("mssql");
var config = require("../config");

var e = require("../utils/utils");
var modLogin = {};

// async/await style:
const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on("error", (err) => {
  error ? e.admError(err) : console.log("...Conectado...");
});

let ins = (logdata) => {
  return `BEGIN IF NOT EXISTS
          (
            SELECT * FROM [Formularios].[dbo].[login]
            WHERE [id_usuario]=${logdata.id_usuario} 
          )
        BEGIN INSERT INTO [Formularios].[dbo].[login]
        ([id_usuario],[nombre_usuario],[password],[Grupo1],[Grupo2],[Grupo3])
          VALUES(${logdata.id_usuario},'${logdata.nombre_usuario}','${logdata.id_usuario}','${logdata.Grupo1}','${logdata.Grupo2}','${logdata.Grupo3}' )
          END 
        END;`;
};

let upd = (logdata) => {
  return `UPDATE [Formularios].[dbo].[login]
          SET [id_usuario] = ${logdata.id_usuario}, [nombre_usuario] = '${logdata.nombre_usuario}', [password] = '${logdata.password}'
          WHERE [id_login] = ${logdata.id_login};`;
};
let del = (logdata) => {
  return `DELETE FROM [Formularios].[dbo].[login]
          WHERE [id_login] = ${logdata.id_login};`;
};
let one = (logdata) => {
  return `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password], [Grupo1], [Grupo2], [Grupo3]
          FROM [Formularios].[dbo].[login]
          WHERE id_login = ${logdata.id_login};`;
};
let log = (logdata) => {
  return `
  SELECT l.id_usuario, l.nombre_usuario, l.Grupo1, l.Grupo2, l.Grupo3, p.nombre_permiso, p.url, p.estado 
  FROM Formularios.dbo.login l
  LEFT OUTER JOIN Formularios.dbo.login_permisos lp on l.id_login = lp.id_login
  FULL OUTER JOIN Formularios.dbo.Permisos p on lp.id_permiso = p.id_Permiso
  WHERE [id_usuario] = ${logdata.usuario} AND [password] = '${logdata.password}';`;
};

let logfull = (logdata) => {
  return `
  SELECT (
    SELECT 	usuario.id_login  as [key], usuario.id_usuario as [codigo], usuario.nombre_usuario as [nombre], usuario.Grupo1 as [g1], usuario.Grupo2  as [g2], usuario.Grupo3  as [g3], 
        modulos.id_modulo as [id], modulos.nombre_modulo as [nombre], modulos.estado_modulo as [estado],
        permisos.id_Permiso as [id], TRIM( permisos.nombre_permiso) as [permiso], TRIM( permisos.url)  as [url],  permisos.estado as [estado],
        reportes.id_reporte as [id], reportes.nombre_reporte as [reporte], reportes.url_reporte as [url], reportes.descripcion_reporte as [descripcion], reportes.estado_reporte  as [estado]
    FROM Formularios.dbo.login usuario 
        full outer  join Formularios.dbo.login_permisos  lp on usuario.id_login = lp.id_login 
        full outer join Formularios.dbo.Permisos permisos on lp.id_permiso = permisos.id_Permiso
        full outer join Formularios.dbo.reportes reportes on permisos.id_Permiso = reportes.id_permiso 
        full outer join Formularios.dbo.modulos modulos on permisos.id_modulo = modulos.id_modulo 
    WHERE [id_usuario] = ${logdata.usuario} AND [password] = '${logdata.password}'
    ORDER BY modulos.id_modulo 
    FOR JSON AUTO
  ) DATA;`;
};
// Permisos de usuario 
let per = (logdata) => {
  console.log(logdata);

  return `

  drop table if exists #PermisosDelUsuario
  drop table if exists #TodosLosPermisos

  select id_Permiso, m.nombre_modulo, p.nombre_permiso, p.url 
  into #TodosLosPermisos 
  from Permisos p
  inner join modulos m on p.id_modulo = m.id_modulo
  where p.estado = 1 and m.estado_modulo = 1

  select	login.id_login						[id_login]
			,trim(modulos.nombre_modulo)		[Modulo]
				,permisos.id_Permiso			[id_permiso] 
				,permisos_login.id_permisoLog	[id_log_permisos]
				,trim(permisos.nombre_permiso)	[permiso]

  into #PermisosDelUsuario
  from login login
  inner join login_permisos permisos_login on login.id_login = permisos_login.id_login
  inner join Permisos permisos on permisos_login.id_permiso = permisos.id_Permiso
  inner join modulos modulos on permisos.id_modulo = modulos.id_modulo
  where login.id_usuario = ${logdata.id_usuario}

  select tp.id_Permiso, tp.nombre_modulo, trim(tp.nombre_permiso) nombre_permiso, trim(tp.url) url, iif(pu.id_login is null,0,1) acceso
  from #TodosLosPermisos tp
  left join #PermisosDelUsuario pu on tp.id_Permiso = pu.id_permiso

  drop table if exists #PermisosDelUsuario
  drop table if exists #TodosLosPermisos
  
  `;
};

// Formularios de usuario
let form = (logdata) => {
  console.log(logdata);

  return `
  drop table if exists #FormulariosDelUsuario
  drop table if exists #TodosLosFormularios

  Select codigo_proceso id_proceso, Personalizado1 tipo, nombre_proceso formulario
  into #TodosLosFormularios
  from Procesos p
  order by Personalizado1, nombre_proceso

  Select lp.id_login_proc, p.codigo_proceso id_proceso, p.Personalizado1 tipo, p.nombre_proceso formulario
  into #FormulariosDelUsuario
  from Procesos p
  inner join login_proceso lp on p.codigo_proceso = lp.id_procesos
  inner join login l on lp.id_usuario = l.id_usuario
  where l.id_usuario = ${logdata.id_usuario}

  select   tf.id_proceso, tf.tipo Tipo, tf.formulario Formulario, iif(fu.id_login_proc is null,0,fu.id_login_proc) Acceso
  from #TodosLosFormularios tf
  left join #FormulariosDelUsuario fu on tf.id_proceso = fu.id_proceso
  order by tf.tipo, tf.formulario

  drop table if exists #FormulariosDelUsuario
  drop table if exists #TodosLosFormularios
  `;
};

// Fincas de usuario
let fics = (logdata) => {
  console.log(logdata);

  return `

  drop table if exists #FincasDelUsuario
  drop table if exists #TodasLasFincas
    
  Select cp.idFinca, cp.Finca
  into #TodasLasFincas
  from CierrePlanoSiembra cp 
  group by cp.idFinca, cp.Finca

  SELECT  id_Desplegable, codigo id_usuario, opcion id_finca
  into #FincasDelUsuario
  FROM [Formularios].[dbo].[Desplegables]
  WHERE Filtro like 'loginfinca' AND codigo = ${logdata.id_usuario}

  select tf.idFinca, tf.finca, iif(fu.id_usuario is null,0, id_Desplegable ) Acceso
  from #TodasLasFincas tf
  left join #FincasDelUsuario fu on tf.idFinca = fu.id_finca
  order by tf.Finca

  drop table if exists #FincasDelUsuario
  drop table if exists #TodasLasFincas

  `;
};


let all = `SELECT [id_login] ,[id_usuario] ,[nombre_usuario] ,[password], [Grupo1], [Grupo2], [Grupo3]
          FROM [Formularios].[dbo].[login]`;

let grupos = `
SELECT distinct [Grupo1] FROM [Formularios].[dbo].[login];
SELECT distinct [Grupo2] FROM [Formularios].[dbo].[login];
SELECT distinct [Grupo3] FROM [Formularios].[dbo].[login];
`;

modLogin.insData = function (logdata, callback) {
  console.log(ins(logdata));

  poolConnect;
  var request = new sql.Request(pool);
  request.query(
    ins(logdata),

    function (error, rows) {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqNoReturn("creado", rows));
      }
    }
  );
};

modLogin.perUserData = function (logdata, callback) {
  console.log('Metodo: ', logdata, per(logdata));

  poolConnect;
  var request = new sql.Request(pool);
  request.query(
    per(logdata),


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
          callback(null, e.paqReturn(rows));
        }
      }
    });
};

modLogin.formsUserData = function (logdata, callback) {
  console.log('Metodo: ', logdata, form(logdata));

  poolConnect;
  var request = new sql.Request(pool);
  request.query(
    form(logdata),


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
          callback(null, e.paqReturn(rows));
        }
      }
    });
};

modLogin.ficsUserData = function (logdata, callback) {
  console.log('Metodo: ', logdata, fics(logdata));

  poolConnect;
  var request = new sql.Request(pool);
  request.query(
    fics(logdata),


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
          callback(null, e.paqReturn(rows));
        }
      }
    });
};

modLogin.updData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool);
  request.query(upd(logdata), function (error, rows) {
    if (error) {
      // Manejo de error en el middleware utils
      callback(null, e.admError(error));
    } else {
      // Empaquetado de resultados en el middleware utils
      callback(null, e.paqNoReturn("actualizado", rows));
    }
  });
};

modLogin.delData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool);
  request.query(del(logdata), function (error, rows) {
    if (error) {
      // Manejo de error en el middleware utils
      callback(null, e.admError(error));
    } else {
      // Empaquetado de resultados en el middleware utils
      callback(null, e.paqNoReturn("eliminado", rows));
    }
  });
};

modLogin.idData = function (logdata, callback) {
  poolConnect;
  // console.log('Data en modulo', logdata)
  var request = new sql.Request(pool);
  request.query(one(logdata), function (error, rows) {
    if (error) {
      // Manejo de error en el middleware utils
      callback(null, e.admError(error));
    } else {
      // Empaquetado de resultados en el middleware utils
      callback(null, e.paqReturn(rows));
    }
  });
};

modLogin.logData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool);
  request.query(log(logdata), function (error, rows) {
    if (error) {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));
    } else {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqReturn(rows));
      }
    }
  });
};

modLogin.logallData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool);
  request.query(logfull(logdata), function (error, rows) {
    if (error) {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));
    } else {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // convertir texto resultante de SQL JSON a JSON
        callback(null, JSON.parse(rows.recordset[0].DATA));
      }
    }
  });
};
modLogin.allData = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool);
  request.query(all, function (error, rows) {
    if (error) {
      // Manejo de error en el middleware utils
      callback(null, e.admError(error));
    } else {
      // Empaquetado de resultados en el middleware utils
      callback(null, e.paqReturn(rows));
    }
  });
};

modLogin.logGru = function (logdata, callback) {
  poolConnect;
  var request = new sql.Request(pool);
  request.query(grupos, function (error, rows) {
    if (error) {
      // Manejo de error en el middleware Error
      callback(null, e.admError(error));
    } else {
      if (error) {
        // Manejo de error en el middleware utils
        callback(null, e.admError(error));
      } else {
        // Empaquetado de resultados en el middleware utils
        callback(null, e.paqReturn(rows));
      }
    }
  });
};

// pool.close()
module.exports = modLogin;