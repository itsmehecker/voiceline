const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log("Connected to signaling server");
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
  console.log("Sending offer");
  socket.send(JSON.stringify({ type: 'offer', offer }));
}

async function sendAnswer(answer) {
  console.log("Sending answer");
  socket.send(JSON.stringify({ type: 'answer', answer }));
}

async function sendCandidate(candidate) {
  console.log("Sending candidate");
  socket.send(JSON.stringify({ type: 'candidate', candidate }));
}

function updateClientCount(count) {
  console.log("Updating client count:", count);
  document.getElementById('client-count').innerText = `Connected clients: ${count}`;
}