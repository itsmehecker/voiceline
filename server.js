const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log("Client connected");
  updateClientCount();

  ws.on('message', message => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return;
    }
    console.log("Received message:", data);
    switch (data.type) {
      case 'offer':
        broadcast(data, ws);
        break;
      case 'answer':
        broadcast(data, ws);
        break;
      case 'candidate':
        broadcast(data, ws);
        break;
    }
  });

  ws.on('close', () => {
    console.log("Client disconnected");
    updateClientCount();
  });
});

function broadcast(data, sender) {
  wss.clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      console.log("Broadcasting message:", data);
      client.send(JSON.stringify(data));
    }
  });
}

function updateClientCount() {
  const clientCount = Array.from(wss.clients).filter(client => client.readyState === WebSocket.OPEN).length;
  console.log(`Connected clients: ${clientCount}`);
  broadcastClientCount(clientCount);
}

function broadcastClientCount(count) {
  const message = JSON.stringify({ type: 'clientCount', count });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("Broadcasting client count:", count);
      client.send(message);
    }
  });
}