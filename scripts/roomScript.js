const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const constraints = window.constraints = {
    audio: true,
    video: true
};

function navigateTo(url) {
    window.location.href = url;
}

// document.addEventListener('DOMContentLoaded', function () {
//     socket.emit('send_offer', BASE_URL)
// });

async function initStream() {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

function handleSuccess(stream) {
    localVideo.srcObject = stream
    localVideo.play()
}

initStream().then(stream => handleSuccess(stream))
