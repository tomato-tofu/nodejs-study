const EventEmitter = require("events");

class MyEventEmitter extends EventEmitter {}

const event = new MyEventEmitter();

event.on("play", (res) => {
  console.log(res);
});

event.on("play", (res) => {
  console.log(res);
});
event.on("sleep", (res) => {
  console.log(res);
});

event.emit("play", "play");
event.emit("sleep", "sleep");
