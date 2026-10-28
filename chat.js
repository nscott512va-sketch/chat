const socket = new WebSocket('ws://' + (location.host || 'localhost:8080'));

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

function addMessage(text) {
  const messageElement = document.createElement('div');
  messageElement.textContent = text;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}

socket.addEventListener('open', () => {
  console.log('Connected to the WebSocket server');
});

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  addMessage(data.content);
});

function sendMessage() {
  const message = messageInput.value;
  if (message && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ content: message }));
    addMessage('You: ' + message); // Show your own message locally
    messageInput.value = '';
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from WebSocket server');
});
