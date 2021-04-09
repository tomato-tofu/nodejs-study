const fs = require("fs");

fs.writeFile("./hello.txt", "hello fs module", (err) => {
  if (err) {
    console.error("文件创建失败");
  } else {
    console.log("file created success");
  }
});

// const buffer = fs.readFileSync();
