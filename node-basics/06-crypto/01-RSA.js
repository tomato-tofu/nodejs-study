const fs = require("fs");
const path = require("path");
const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 2048 }); //生成2048位的密钥
var publicDer = key.exportKey("pkcs1-public-pem"); //公钥
var privateDer = key.exportKey("pkcs1-private-pem"); //私钥
fs.mkdirSync(path.join(__dirname, "crypto"), { recursive: true }, (err) => {
  if (err) throw err;
});

fs.writeFileSync(path.join(__dirname, "crypto/public-key.pem"), publicDer);
fs.writeFileSync(path.join(__dirname, "crypto/private-key.pem"), privateDer);
