const express = require("express");
const bodyParser = require("body-parser");

const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/list", (req, res) => res.send("Hello World!"));

app.post("/list", multipartMiddleware, (req, res) => {
  console.log(req.body);
  res.send("hello from simple server : post");
});

app.put("/list", (req, res) => {
  const body = req.body;
  console.log(body);
  res.send("hello from simple server : put)");
});
app.patch("/list", (req, res) => {
  res.send("hello from simple server : patch)");
});

app.delete("/list", (req, res) => {
  res.send("hello from simple server : delete)");
});

app.listen(port, () => console.log(`Example app listening on port port!`));
