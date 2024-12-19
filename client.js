const socket = new WebSocket('wss://voiceline.herokuapp.com');

socket.onopen = () => {
  console.log("Connected to signaling server");
};

socket.onmessage = async event => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return;
  }
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

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peerConnection = new RTCPeerConnection();

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  });

peerConnection.ontrack = event => {
  remoteVideo.srcObject = event.streams[0];
};

peerConnection.onicecandidate = event => {
  if (event.candidate) {
    sendCandidate(event.candidate);
  }
};

async function handleOffer(offer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendAnswer(answer);
}

async function handleAnswer(answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleCandidate(candidate) {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

async function call() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  sendOffer(offer);
}

document.getElementById('connectButton').addEventListener('click', () => {
  startCall();
});

function startCall() {
  console.log('Connecting...');
  call();
}

call();