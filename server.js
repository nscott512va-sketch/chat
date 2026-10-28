const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = 8080;

// Serve chat.html and chat.js over plain HTTP
const files = {
  '/': ['chat.html', 'text/html'],
  '/chat.html': ['chat.html', 'text/html'],
  '/chat.js': ['chat.js', 'text/javascript'],
};

const server = http.createServer((req, res) => {
  const entry = files[req.url.split('?')[0]];
  if (!entry) {
    res.writeHead(404);
    return res.end('Not found');
  }
  fs.readFile(path.join(__dirname, entry[0]), (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error reading file');
    }
    res.writeHead(200, { 'Content-Type': entry[1] });
    res.end(data);
  });
});

// WebSocket server shares the same port
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message, isBinary) => {
    console.log('Received:', message.toString());
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isBinary });
      }
    });
  });

  ws.send(JSON.stringify({ content: 'Welcome to the chat!' }));
});

server.listen(PORT, () => {
  console.log(`Open http://localhost:${PORT} in your browser`);
});
