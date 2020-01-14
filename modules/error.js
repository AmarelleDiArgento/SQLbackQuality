var modeloError = {};



modeloError.admError = function (error, callback) {
  console.log('Procesando error...');
  console.log(
    ' ------------------------------------------------------------------------ ERROR ------------------------------------------------------------------------ \n',
    error,
    '\n ------------------------------------------------------------------------ ERROR ------------------------------------------------------------------------ \n ')

  switch (error.code) {
    case 'EINSTLOOKUP':
      console.log(error.name + ': ', error.code);
      return {
        respuesta: 'error',
          error: {
            code: error.code,
            mensaje: error.originalError.message,
            detalle: `${error.name}: \n ${error.originalError}`
          }
      }

      case 'ECONNCLOSED':
        console.log(error.name + ': ', error.code);
        return {
          respuesta: 'error',
            error: {
              code: error.code,
              mensaje: 'Connection is closed'
            }
        }
        case 'ETIMEOUT':
          return {
            respuesta: 'error',
              error: {
                code: error.code,
                mensaje: error.originalError.message,
                detalle: `${error.name}: \n ${error.originalError}`
              }
          }
          case 'ESOCKET':
            return {
              respuesta: 'error',
                error: {
                  code: error.code,
                  mensaje: error.originalError.message,
                  detalle: `${error.name}: \n ${error.originalError}`
                }
            }

            case 'EREQUEST':
              console.log(error.name + ': ', error.code);
              return {
                respuesta: 'error',
                  error: {
                    code: error.code,
                    mensaje: error.originalError.info.message,
                    detalle: error
                  }
              }
              default:
                return {
                  respuesta: 'error',
                    error: {
                      code: 'Desconocido: ' + error.code,
                      mensaje: error
                    }
                }
  }
}


module.exports = modeloError;