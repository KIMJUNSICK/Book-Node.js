const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map(v => v.split("="))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {};

const server = http.createServer((req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  if (req.url.startsWith("/login")) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    const randomInt = Date.now();
    session[randomInt] = {
      name,
      expires
    };
    res.writeHead(302, {
      Location: "/",
      "Set-Cookie": `session=${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
    });
    res.end();
  } else if (cookies.session && session[cookies.session].expires > new Date()) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`${session[cookies.session].name}님 안녕하세요`);
  } else {
    fs.readFile("./index.html", (err, data) => {
      if (err) {
        throw err;
      }
      res.end(data);
    });
  }
});

server.listen(8080);
server.on("listening", () => {
  console.log("Listening on:✅  http://localhost:8080");
});
server.on("error", error => {
  console.log(error);
});
