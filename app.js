var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const fs = require("fs");
const cors = require('cors');

var index = require('./routes/index');
var login = require('./routes/login');
var proceso = require('./routes/proceso');
var procesos_detalle = require('./routes/Procesos_Detalle');
var desplegable = require('./routes/desplegable');
var grafica = require('./routes/grafica');


// At the top of your server.js
process.env.PWD = process.cwd();

var app = express();
app.use(bodyParser());
app.use(
  bodyParser.json({
    limit: "5mb"
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//access cors

app.use(cors());

app.use(function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("charset", "utf-8");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Then
app.use(express.static(process.env.PWD + "/public"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.disable("etag");
app.use("/", index);

//urls user
app.post("/logins", login);
app.put("/logupd/:id", login);
app.delete("/logdel/:id", login);
app.post("/login", login);
app.post("/logone/:id", login);
app.get("/logall", login);

//urls procesos
app.post("/proins", proceso);
app.put("/proupd/:id", proceso);
app.delete("/prodel/:id", proceso);
app.post("/proone/:id", proceso);
app.get("/proall", proceso);

//urls procesos detalle
app.post("/pdins", procesos_detalle);
app.put("/pdupd/:id", procesos_detalle);
app.delete("/pddel/:id", procesos_detalle);
app.post("/pdone/:id", procesos_detalle);
app.post("/pdfil/:id", procesos_detalle);
app.get("/pdall", procesos_detalle);


//urls desplegables
app.post("/desins", desplegable);
app.put("/desupd/:id", desplegable);
app.delete("/desdel/:id", desplegable);
app.post("/desone/:id", desplegable);
app.post("/desfil/:id", desplegable);
app.get("/desall", desplegable);


//urls grafica
// app.post("/proins", proceso);
// app.put("/proupd/:id", proceso);
// app.delete("/prodel/:id", proceso);
// app.post("/proone/:id", proceso);
 app.post("/grapos", grafica);
 app.post("/gracul", grafica);
 app.post("/grapla", grafica);
 app.post("/graexp", grafica);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));   
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;