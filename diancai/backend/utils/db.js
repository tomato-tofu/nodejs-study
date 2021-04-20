// getting-started.js
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/menu-admin", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

var menusSchema = mongoose.Schema({
  name: String,
});

var usersSchema = mongoose.Schema({
  name: String,
  password: String,
});

var Menus = mongoose.model("menus", menusSchema);

var Users = mongoose.model("users", usersSchema);

module.exports = {
  Menus,
  Users,
};
