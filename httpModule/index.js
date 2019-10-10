const http = require("http");
const fs = require("fs");

// http.createServer(callback)
const server = http.createServer((req, res) => {
  fs.readFile("./index.html", (err, data) => {
    if (err) {
      throw err;
    }
    res.end(data);
  });
});

server.listen(8080);
server.on("listening", () => {
  console.log("Listening on:✅  http://localhost:8080");
});
server.on("error", error => {
  console.log(error);
});
