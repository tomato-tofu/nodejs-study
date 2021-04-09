const fs = require("fs");
const path = require("path");
const template = require("art-template");

const { listObj } = require("./modal/list");

const list = (req, res, next) => {
  res.send(JSON.stringify(listObj));
};

const ssr = (req, res) => {
  res.render("list-html", {
    data: listObj.data,
  });
};

const ssrfile = (req, res) => {
  const html = template(path.join(__dirname, "./view/list-html.art"), {
    data: listObj.data,
  });

  fs.writeFileSync(path.join(__dirname, "./public/ssrlist.html"), html);

  res.send("ssr file done!");
};

module.exports = {
  list,
  ssr,
  ssrfile,
};
