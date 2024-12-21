// ...existing code...

const servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

let localStream;
let peerConnection;

async function startWebRTC() {
  console.log("Starting WebRTC...");
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  console.log("Local stream obtained");
  peerConnection = new RTCPeerConnection(servers);

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
      sendCandidate(event.candidate);
    }
  };

  peerConnection.ontrack = event => {
    console.log("Received remote track");
    const remoteAudio = document.createElement('audio');
    remoteAudio.srcObject = event.streams[0];
    remoteAudio.play();
  };

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("Sending offer");

  sendOffer(offer);
}

async function handleOffer(offer) {
  console.log("Received offer");
  peerConnection = new RTCPeerConnection(servers);

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
      sendCandidate(event.candidate);
    }
  };

  peerConnection.ontrack = event => {
    console.log("Received remote track");
    const remoteAudio = document.createElement('audio');
    remoteAudio.srcObject = event.streams[0];
    remoteAudio.play();
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  console.log("Local stream obtained");
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  console.log("Sending answer");

  sendAnswer(answer);
}

async function handleAnswer(answer) {
  console.log("Received answer");
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleCandidate(candidate) {
  console.log("Received ICE candidate");
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// ...existing code...
