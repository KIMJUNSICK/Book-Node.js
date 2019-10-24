import WebSocket from "ws";

export default server => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("New Client connected", ip);

    ws.on("message", message => console.log(message));
    ws.on("error", err => console.error(err));
    ws.on("close", () => {
      console.log("Client Disconnected ");
      clearInterval(ws.interval);
    });

    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send("server is sending message to client");
      }
    }, 3000);

    // eslint-disable-next-line no-param-reassign
    ws.interval = interval;
  });
};
