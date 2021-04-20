var express = require("express");
var app = express();
app.use(express.static("./mvvm")).listen(3000);
