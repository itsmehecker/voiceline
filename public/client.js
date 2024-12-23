const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let peerConnection;
const socket = new WebSocket('ws://localhost:3000');

const constraints = {
  audio: true,
  video: false
};

startButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  peerConnection = new RTCPeerConnection();
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      socket.send(JSON.stringify({ type: 'candidate', candidate }));
    }
  };

  peerConnection.ontrack = ({ streams: [stream] }) => {
    const audio = document.createElement('audio');
    audio.srcObject = stream;
    audio.play();
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.send(JSON.stringify({ type: 'offer', offer }));
};

stopButton.onclick = () => {
  localStream.getTracks().forEach(track => track.stop());
  peerConnection.close();
  socket.close();
};

socket.onmessage = async ({ data }) => {
  const message = JSON.parse(data);
  if (message.type === 'offer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: 'answer', answer }));
  } else if (message.type === 'answer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
  } else if (message.type === 'candidate') {
    await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
  }
};
