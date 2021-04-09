const https = require("https");

const server = https.get(
  "https://www.baidu.com/sugrec?prod=pc_his&from=pc_web&json=1&sid=33242_33749_33344_31254_33392_33714_26350&hisdata=%5B%7B%22time%22%3A1617262999%2C%22kw%22%3A%22vue2%20defineprototype%22%7D%2C%7B%22time%22%3A1617264817%2C%22kw%22%3A%22win10%20%E5%85%B3%E9%97%AD%E4%BF%9D%E6%8A%A4%22%7D%2C%7B%22time%22%3A1617324776%2C%22kw%22%3A%22html5%20keygen%22%7D%2C%7B%22time%22%3A1617326080%2C%22kw%22%3A%22npm%20install%20jshint%20error%22%7D%2C%7B%22time%22%3A1617328244%2C%22kw%22%3A%22nodejs%20assert%22%7D%2C%7B%22time%22%3A1617330782%2C%22kw%22%3A%22nodejs%20v%22%7D%2C%7B%22time%22%3A1617330787%2C%22kw%22%3A%22nodejs%20v8%E5%BC%95%E6%93%8E%22%7D%2C%7B%22time%22%3A1617334414%2C%22kw%22%3A%22eflags%E5%AF%84%E5%AD%98%E5%99%A8%22%7D%2C%7B%22time%22%3A1617335176%2C%22kw%22%3A%22idt%E8%A1%A8%200x2%22%7D%2C%7B%22time%22%3A1617344285%2C%22kw%22%3A%22%E5%9C%A8%E7%BA%BF%20%E6%B5%8B%E8%AF%95%E6%8E%A5%E5%8F%A3%22%7D%5D&_t=1617344338373&req=2&bs=%E5%9C%A8%E7%BA%BF%20%E6%B5%8B%E8%AF%95%E6%8E%A5%E5%8F%A3&csor=0",
  (res) => {
    let str = "";
    res.on("data", (chunk) => {
      str += chunk;
    });

    res.on("end", () => {
      console.log(str);
    });
  }
);
