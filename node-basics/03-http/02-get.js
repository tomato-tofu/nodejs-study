const https = require("https");
const http = require("http");
const logger = require("../utils/log/server");
http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/json;charset=utf-8",
    });
    https.get(
      "https://blog.csdn.net/phoenix/web/v1/isCollect?articleId=78393035",
      (result) => {
        let data = "";
        result.on("data", (chunk) => {
          data += chunk;
        });
        result.on("end", () => {
          logger.trace(data);
          res.end(`${data}`);
        });
      }
    );
  })
  .listen(8080, () => {
    console.log("localhost:8080");
  });
