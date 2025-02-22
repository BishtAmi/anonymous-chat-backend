const WebSocket = require('ws');
const http = require('http');
const { handleConnection } = require('./controllers/connection');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => handleConnection(ws, wss));

server.listen(8080, () => {
    console.log('WebSocket server running on ws://localhost:8080');
});
