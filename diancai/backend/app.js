var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const menu = require("./routes/menu");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(cors());

app.use("/api/menu", menu);

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

var lineArr24 = [
  [127, 34],
  [127, 21],
  [110, 15],
]; //24小时警戒线坐标集合
var lineArr48 = [
  [132, 34],
  [132, 15],
  [105, 0],
]; //48小时警戒线集合

var symbol24 = new esri.symbol.SimpleLineSymbol(
  esri.symbol.SimpleLineSymbol.STYLE_SOLID,
  new dojo.Color([255, 0, 0]),
  1
);
var symbol48 = new esri.symbol.SimpleLineSymbol(
  esri.symbol.SimpleLineSymbol.STYLE_DASHDOTDOT,
  new dojo.Color([255, 255, 153]),
  1
);

var T_Symbol = new esri.symbol.SimpleFillSymbol(
  esri.symbol.SimpleFillSymbol.STYLE_SOLID,
  new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([255, 165, 0]),
    0.01
  ),
  new dojo.Color([255, 20, 147, 0.35])
);
var Line_symbol = new esri.symbol.SimpleLineSymbol(
  esri.symbol.SimpleLineSymbol.STYLE_DASHDOTDOT,
  new dojo.Color([255, 215, 0]),
  1
);
