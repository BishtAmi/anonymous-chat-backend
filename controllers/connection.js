const WebSocket = require("ws");
const queue = []; // Queue to hold waiting users
const pairs = new Map(); // Map to track connected pairs

function handleConnection(ws, wss) {
  console.log("New user connected");

  queue.push(ws);
  matchUsers();

  ws.on("message", (message) => {
    const readableMsg = message.toString();
    if (pairs.has(ws)) {
      const partner = pairs.get(ws);
      if (partner.readyState === WebSocket.OPEN) {
        partner.send(readableMsg);
      }
    }
  });

  ws.on("close", () => {
    console.log("User disconnected");
    removeUser(ws);
  });
}

// match first 2 users from the queue
function matchUsers() {
  while (queue.length >= 2) {
    const user1 = queue.shift();
    const user2 = queue.shift();

    if (
      user1.readyState === WebSocket.OPEN &&
      user2.readyState === WebSocket.OPEN
    ) {
      pairs.set(user1, user2);
      pairs.set(user2, user1);

      user1.send("Connected to a stranger! Say hi!");
      user2.send("Connected to a stranger! Say hi!");
    }
  }
}

function removeUser(ws) {
  const index = queue.indexOf(ws);
  if (index !== -1) queue.splice(index, 1);
  // if user have a partner inform the partner
  if (pairs.has(ws)) {
    const partner = pairs.get(ws);
    pairs.delete(ws);
    pairs.delete(partner);
    if (partner.readyState === WebSocket.OPEN) {
      partner.send("Your partner disconnected. Searching for a new match...");
      queue.push(partner);
      matchUsers();
    }
  }
}

module.exports = { handleConnection };
