const http = require("http");
const https = require("https");
const { createProxyMiddleware } = require("http-proxy-middleware");

http
  .createServer((request, response) => {
    const url = request.url;
    if (/\/zhihu/.test(url)) {
      const proxy = createProxyMiddleware("/zhihu", {
        target:
          "https://www.zhihu.com/api/v3/feed/topstory/recommend?session_token=4f933686ed0d5575199389bf9c30c1ec&desktop=true&page_number=2&limit=6&action=down&after_id=5&ad_interval=-1",
        changeOrigin: true,
      });
      proxy(request, response);
    }
    if (/\/xiaomi\/order/.test(url)) {
      const proxy2 = createProxyMiddleware("/xiaomi/order", {
        target:
          "https://api2.order.mi.com/product/delivery?goods_ids=2200300014&item_ids=&province_id=2&city_id=36&district_id=384&area=384010&t=1617759900",
        changeOrigin: true,
      });
      proxy2(request, response);
    }
    if (/\/lago/.test(url)) {
      const proxy2 = createProxyMiddleware("/lago", {
        target: "https://activity.lagou.com",
        changeOrigin: true,
        pathRewrite: {
          "^/lago": "",
        },
      });
      proxy2(request, response);
    } else {
      console.error("no router");
    }
  })
  .listen(8080, () => {
    console.log("localhost:8080");
  });
