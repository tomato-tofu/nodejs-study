const http = require("http");

http
  .createServer((request, response) => {
    const url = request.url;
    console.log(url);
    switch (url) {
      case "/api/getdata":
        response.write(`getdata('hello')`);
        break;
      default:
        response.write("not found");
    }

    response.end();
  })
  .listen(8080, () => {
    console.log("localhost:8080");
  });
