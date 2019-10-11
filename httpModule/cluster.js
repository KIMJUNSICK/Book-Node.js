const http = require("http");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`master process id: ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid} has been termiated`);
    cluster.fork();
  });
} else {
  http
    .createServer((req, res) => {
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Cluster</p>");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    })
    .listen(8080);

  console.log(`Walker ${process.pid} Run`);
}
