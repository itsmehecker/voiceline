const socketUrl = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const socket = new WebSocket(`${socketUrl}129.159.23.70:8080`);

socket.onopen = () => {
  console.log("Connected to signaling server");
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onmessage = async event => {
  const data = JSON.parse(event.data);
  console.log("Received message:", data);
  switch (data.type) {
    case 'offer':
      await handleOffer(data.offer);
      break;
    case 'answer':
      await handleAnswer(data.answer);
      break;
    case 'candidate':
      await handleCandidate(data.candidate);
      break;
    case 'clientCount':
      updateClientCount(data.count);
      break;
  }
};

async function sendOffer(offer) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("Socket is not open. Cannot send offer.");
    return;
  }
  console.log("Sending offer");
  socket.send(JSON.stringify({ type: 'offer', offer }));
}

async function sendAnswer(answer) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("Socket is not open. Cannot send answer.");
    return;
  }
  console.log("Sending answer");
  socket.send(JSON.stringify({ type: 'answer', answer }));
}

async function sendCandidate(candidate) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("Socket is not open. Cannot send candidate.");
    return;
  }
  socket.send(JSON.stringify({ type: 'candidate', candidate }));
}

function updateClientCount(count) {
  console.log("Updating client count:", count);
  document.getElementById('client-count').innerText = `Connected clients: ${count}`;
}

// Ensure sendCandidate is defined after socket initialization
peerConnection.onicecandidate = event => {
  if (event.candidate) {
    console.log("Sending ICE candidate");
    sendCandidate(event.candidate);
  }
};