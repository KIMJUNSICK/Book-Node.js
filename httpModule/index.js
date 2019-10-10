const http = require("http");

const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map(v => v.split("="))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const server = http.createServer((req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  console.log(req.url, cookies);
  res.writeHead(200, { "Set-Cookie": "mycookie=test" });
  res.end("Hello Cookie");
});

server.listen(8080);
server.on("listening", () => {
  console.log("Listening on:✅  http://localhost:8080");
});
server.on("error", error => {
  console.log(error);
});
