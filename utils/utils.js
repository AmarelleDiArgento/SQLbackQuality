var modeloUtils = {};



modeloUtils.admError = function (error, callback) {
  console.log('Procesando error...');
  console.log(
    '\n ------------------------------------------------------------------------ ERROR ------------------------------------------------------------------------ \n',
    error,
    '\n ------------------------------------------------------------------------ ERROR ------------------------------------------------------------------------ \n ')

  switch (error.code) {
    case 'EINSTLOOKUP':
      // console.log(error.name + ': ', error.code);
      return {

        respuesta: 'error',
          rows: [],
          output: {
            code: error.code,
            mensaje: error.originalError.message,
            detalle: `${error.name}: \n ${error.originalError}`
          },
          rowsAffected: []

      }

      case 'ECONNCLOSED':
        // console.log(error.name + ': ', error.code);
        return {

          respuesta: 'error',
            rows: [],
            output: {
              code: error.code,
              mensaje: 'No hay conexion'
            },
            rowsAffected: []

        }
        case 'ETIMEOUT':
          return {

            respuesta: 'error',
              rows: [],
              output: {
                code: error.code,
                mensaje: error.originalError.message,
                detalle: `${error.name}: \n ${error.originalError}`
              },
              rowsAffected: []

          }
          case 'ESOCKET':
            return {

              respuesta: 'error',
                rows: [],
                output: {
                  code: error.code,
                  mensaje: error.originalError.message,
                  detalle: `${error.name}: \n ${error.originalError}`
                },
                rowsAffected: []

            }

            case 'EREQUEST':
              // console.log(error.name + ': ', error.code);
              return {

                respuesta: 'error',
                  rows: [],
                  output: {
                    code: error.code,
                    mensaje: error.originalError.info.message,
                    detalle: error
                  },
                  rowsAffected: []

              }
              default:
                return {

                  respuesta: 'error',
                    rows: [],
                    output: {
                      code: 'Desconocido: ' + error.code,
                      mensaje: error
                    },
                    rowsAffected: []
                }
  }
}
modeloUtils.paqReturn = function (rows, rollback) {

  // console.log(rows);

  if (rows.recordset.length != 0) {
    return {
      respuesta: 'success',
      rows: rowsReturn(rows),
      output: rows.output,
      rowsAffected: rows.rowsAffected
    }
  } else {
    return {
      respuesta: 'error',
      rows: [],
      output: {
        code: 0,
        mensaje: 'No hay datos',
        detalle: 'La consulta no arroja datos.'
      },
      rowsAffected: rows.rowsAffected

    };
  }
}
let rowsReturn = (rows) => {
  if (rows.recordsets.length > 1) {
    // console.log('RecordSets', rows.recordsets);

    return rows.recordsets
  } else {
    // console.log('RecordSet', rows.recordset);
    return (rows.recordset.length > 1) ? rows.recordset : rows.recordset[0]
  }
}

modeloUtils.paqNoReturn = function (accion, rows) {

  // console.log(rows);

  if (rows.rowsAffected != 0) {
    return {
      respuesta: 'success',
      rows: [],
      output: {
        code: 0,
        mensaje: 'Registro ' + accion,
        detalle: ''
      },
      rowsAffected: rows.rowsAffected
    }
  } else {
    return {
      respuesta: 'warning',
      rows: [],
      output: {
        code: 0,
        mensaje: 'Sin cambios',
        detalle: 'No se ha logrado efectuar la modificacion solicitada.'
      },
      rowsAffected: rows.rowsAffected

    };
  }
}


module.exports = modeloUtils;