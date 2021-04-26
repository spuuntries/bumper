require("dotenv").config();
const Discord = require(`discord.js`);
const client = new Discord.Client();
const token = process.env.TOKEN;
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const options = {
  /* ... */
};
const io = require("socket.io")(httpServer, options);
const procenv = process.env;
const morgan = require("morgan");
const twdne = require("twdne.js");
const slowDown = require("express-slow-down");
const { DateTime } = require("luxon");

// app.enable("trust proxy");
// only if behind a reverse proxy

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: 1000,
});

var waifu = { img: "/kekboiii.png" };
var trig = "Unknown";
var last = "Unknown";
var othig = "Unknown";
var worship = 0;
var stdt = DateTime.now().toUTC().toJSDate().toString() + " [UTC TIME]";
var pstat = [];

function login() {
  client
    .login(token)
    .then(() => {
      console.log(
        `${new Date()}: ${client.user.tag} v${
          require("./package.json").version
        } ready to remind!`
      );
    })
    .catch(() => {
      login();
    });
}

login();

client.on(`message`, (message) => {
  if (message.author.id == procenv.DID) {
    if (message.content.toLowerCase().includes(`bump done`)) {
      console.log(`${new Date()}: Detected trigger, sending in 2 hours.`);
      trig = DateTime.now().toUTC().toJSDate().toString() + " [UTC TIME] ";
      othig =
        DateTime.now().plus({ hours: 2 }).toUTC().toJSDate().toString() +
        " [UTC TIME] ";
      var bumpchan = message.channel;
      if (Tim) {
        clearTimeout(Tim);
      }
      var Tim = setTimeout(() => {
        function send() {
          bumpchan.send(
            `Beep Boop, you can prolly bump now, I think <:stoopid:805703208882274374>`
          );
          bumpchan
            .send(`<:chickwhip:788385688063442974>`)
            .then((msg) => {
              console.log(`${new Date()}: reminder sent on ${msg.createdAt}`);
              last =
                DateTime.now().toUTC().toJSDate().toString() + " [UTC TIME] ";
              othig = "Unknown";
            })
            .catch(() => {
              console.log(
                `${new Date()}: reminder failed to send! Retrying...`
              );
              send();
            });
        }

        send();
      }, 7200000);
    }
  }
  if (message.author.id == procenv.OID) {
    if (message.content.toLowerCase().includes(`bumptest`)) {
      console.log(`${new Date()}: Detected testing trigger, sending in 2s.`);
      trig =
        DateTime.now().toUTC().toJSDate().toString() +
        " [UTC TIME] [DEBUGGING]";
      othig =
        DateTime.now().plus({ seconds: 2 }).toUTC().toJSDate().toString() +
        " [UTC TIME] [DEBUGGING]";
      var bumpchan = message.channel;
      if (Tim) {
        clearTimeout(Tim);
      }
      var Tim = setTimeout(() => {
        function send() {
          bumpchan.send(
            `Beep Boop, you can prolly bump now, I think <:stoopid:805703208882274374>`
          );
          bumpchan
            .send(`<:chickwhip:788385688063442974>`)
            .then((msg) => {
              console.log(`${new Date()}: reminder sent on ${msg.createdAt}`);
              last =
                DateTime.now().toUTC().toJSDate().toString() +
                " [UTC TIME] [DEBUGGING]";
              othig = "Unknown";
            })
            .catch(() => {
              console.log(
                `${new Date()}: reminder failed to send! Retrying...`
              );
              send();
            });
        }
        send();
      }, 2000);
    }
  }
});

setInterval(async () => {
  waifu = await twdne.randomWaifu();
  var obj = {};
  var mins;
  if (DateTime.now().toUTC().toJSDate().getMinutes().toString().length == 1) {
    mins = "0" + DateTime.now().toUTC().toJSDate().getMinutes().toString();
  } else {
    mins = DateTime.now().toUTC().toJSDate().getMinutes().toString();
  }
  obj[DateTime.now().toUTC().toJSDate().getHours().toString() + ":" + mins] =
    client.ws.ping;
  pstat.push(obj);
  if (pstat.length > 5) {
    pstat = pstat.slice(Math.max(pstat.length - 5, 0));
  }
}, 10000);

io.on("connection", (socket) => {
  setInterval(() => {
    socket.emit("pingInfo", {
      ping: client.ws.ping,
      uptime: Math.round(process.uptime()),
      last: last,
      god: waifu.img,
      trig: trig,
      stdt: stdt,
      next: othig,
      pstat: pstat,
    });
    socket.emit("updateWorship", {
      num: worship,
    });
  }, 1000);
  socket.on("worship", (arg) => {
    worship = worship + 1;
    socket.emit("updateWorship", {
      num: worship,
    });
  });
});

app.use(speedLimiter);
app.use(morgan("dev"));
app.use(morgan("combined"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("*", (req, res) => {
  res.send("[ERR] 42069 [ERR]");
});

httpServer.listen(procenv.PORT, () => {
  console.log(new Date() + ": Listening on port " + procenv.PORT);
});
