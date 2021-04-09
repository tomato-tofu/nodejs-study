const fs = require("fs");
const fsPromises = require("fs").promises;
// 创建文件夹啊
// fs.mkdir("logs", (err) => {
//   console.error(err);
// });

//重命名文件夹
// fs.rename("./logs", "log", (err) => {
//   console.error(err);
// });

// 删除文件夹
// fs.rmdir("./log", (err) => {
//   console.error(err);
// });
// 获取文件夹
// fs.readdir("./logs", (err, res) => {
//   console.log(res);
// });

// fs.writeFile("./logs/1.txt", "hello \nworld", (err) => {
//   console.log("done.");
// });

// fs.appendFile("./logs/2.txt", "hello \nworld", (err) => {
//   console.log("done.");
// });
// console.log("appending");

// fs.readFile("./logs/1.txt", (err, data) => {
//   console.log(data.toString());
// });
// fs.readFile(
//   "./logs/1.txt",
//   {
//     encoding: "utf-8",
//   },
//   (err, data) => {
//     console.log(data);
//   }
// );

// const content = fs.readFileSync("./logs/1.txt", { encoding: "utf-8" });
// console.log(content);
// console.log("done.");

// (async () => {
//   let res = await fsPromises.readFile("./logs/1.txt", { encoding: "utf-8" });
//   console.log(res);
//   console.log("done.");
// })();

// for (let i = 0; i < 10; i++) {
//   fs.writeFile(`./logs/${i}.txt`, `${i} file`, () => {
//     console.log(`done ${i}`);
//   });
// }

function readfileSync(path) {
  const files = fs.readdirSync(path);
  files.forEach((filename, i) => {
    const joinPath = `${path}/${filename}`;
    const stats = fs.statSync(joinPath);
    if (stats.isFile()) {
      const conetent = fs.readFileSync(joinPath, "utf-8");
      console.log(conetent);
    } else {
      readfileSync(joinPath);
    }
  });
}

readfileSync("./logs");
