const http = require("http");
const fs = require("fs");

const users = {};

const handleMethod = (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      return fs.readFile("./restFront.html", (err, data) => {
        if (err) {
          throw err;
        }
        res.end(data);
      });
    } else if (req.url === "/about") {
      return fs.readFile("./about.html", (err, data) => {
        if (err) {
          throw err;
        }
        res.end(data);
      });
    } else if (req.url === "/users") {
      return res.end(JSON.stringify(users));
    }
    return fs.readFile(`.${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, "Not Found");
        return res.end("Not found");
      }
      return res.end(data);
    });
  } else if (req.method === "POST") {
    if (req.url === "/users") {
      let body = "";
      req.on("data", data => {
        body += data;
      });
      return req.on("end", () => {
        console.log("POST body: ", body);
        const { name } = JSON.parse(body);
        const id = Date.now();
        users[id] = name;
        res.writeHead(201);
        res.end("success");
      });
    }
  } else if (req.method === "PUT") {
    if (req.url.startsWith("/users/")) {
      const key = req.url.split("/")[2];
      let body = "";
      req.on("data", data => {
        body += data;
      });
      return req.on("end", () => {
        console.log("PUT body: ", body);
        users[key] = JSON.stringify(body).name;
        return res.end(JSON.stringify(users));
      });
    }
  } else if (req.method === "DELETE") {
    if (req.url.startsWith("/users/")) {
      const key = req.url.split("/")[2];
      delete users[key];
      return res.end(JSON.stringify(users));
    }
  }
  res.writeHead(404, "NOT FOUND");
  return res.end("NOT FOUND");
};

const server = http.createServer(handleMethod);

server.listen(8080);
server.on("listening", () => {
  console.log("Listening on: http://localhost:8080");
});
