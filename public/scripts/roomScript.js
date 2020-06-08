const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const constraints = window.constraints = {
    audio: false,
    video: true
};

function initStream() {
    return navigator.mediaDevices.getUserMedia(constraints);
}

function handleSuccess(stream) {
    localVideo.srcObject = stream
    localVideo.play()
}

initStream().then(stream => handleSuccess(stream))
