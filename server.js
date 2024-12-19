// ...existing code...
const http = require('http');

app.use(express.json());

app.post('/signal', (req, res) => {
  const message = req.body;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
  res.sendStatus(200);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

});

// ...existing code...

const WebSocket = require('ws');


    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });