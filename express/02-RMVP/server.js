const express = require("express");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const path = require("path");

const multipartMiddleware = multipart();
const router = require("./router");

const app = express();
const port = 3000;

app.engine("art", require("express-art-template"));
app.set("view options", {
  debug: process.env.NODE_ENV !== "production",
});

app.set("views", path.join(__dirname, "view"));

app.set("view engine", "art");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", multipartMiddleware, router);

app.use(express.static("public"));

app.listen(port, () => console.log(`Example app listening on port port!`));
