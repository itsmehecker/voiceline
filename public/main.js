const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const videoSource = document.getElementById('videoSource');
const audioSource = document.getElementById('audioSource');
const roomName = document.getElementById('roomName');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const home = document.getElementById('home');
const call = document.getElementById('call');
const socket = io();

let localStream;
let peerConnection;
let room;

const servers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};

startButton.addEventListener('click', startCall);
stopButton.addEventListener('click', stopCall);

async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    
    videoSource.innerHTML = '';
    videoDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${videoSource.length + 1}`;
        videoSource.appendChild(option);
    });

    audioSource.innerHTML = '';
    audioDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Microphone ${audioSource.length + 1}`;
        audioSource.appendChild(option);
    });
}

async function startStream() {
    const videoConstraints = {
        deviceId: videoSource.value ? { exact: videoSource.value } : undefined
    };
    const audioConstraints = {
        deviceId: audioSource.value ? { exact: audioSource.value } : undefined
    };
    localStream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: audioConstraints });
    localVideo.srcObject = localStream;
}

function createPeerConnection() {
    peerConnection = new RTCPeerConnection(servers);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('candidate', { candidate: event.candidate, room });
        }
    };

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
}

socket.on('offer', async (data) => {
    const { offer, from } = data;
    if (!peerConnection) {
        createPeerConnection();
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', { answer, room });
});

socket.on('answer', async (data) => {
    const { answer, from } = data;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', async (data) => {
    const { candidate, from } = data;
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

async function startCall() {
    room = roomName.value;
    if (room === '') {
        alert('Please enter a room name.');
        return;
    }
    socket.emit('join', room);
    await startStream();
    createPeerConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', { offer, room });
    home.classList.add('hidden');
    call.classList.remove('hidden');
}

function stopCall() {
    localStream.getTracks().forEach(track => track.stop());
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    home.classList.remove('hidden');
    call.classList.add('hidden');
}

getDevices();
