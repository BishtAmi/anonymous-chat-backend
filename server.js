const WebSocket = require("ws");
const http = require("http");
const { handleConnection } = require("./controllers/connection");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => handleConnection(ws, wss));
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log("WebSocket server running on ws://localhost:8080");
});
