const createRoom = document.getElementById('create');
const roomId = document.getElementById('roomIdInput');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

createRoom.addEventListener('click', ev => {
    window.location.href = 'http://localhost:8080' + '/' + roomId.value + '#initiator';
})