const http = require("http");

http
  .createServer((request, response) => {
    const url = request.url;
    console.log(url);
    switch (url) {
      case "/api/getdata":
        response.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        });
        response.write(`{"code":0, "data":"hello"}`);
        break;
      default:
        response.write("not found");
    }

    response.end();
  })
  .listen(8080, () => {
    console.log("localhost:8080");
  });
