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
  [fecha] between '${fIn} 00:00:00' and '${fFi} 23:59:59'
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