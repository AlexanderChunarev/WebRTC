const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);

