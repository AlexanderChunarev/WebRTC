const createRoom = document.getElementById('create');
const roomId = document.getElementById('roomIdInput');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const socket = io.connect('http://localhost:8080');

createRoom.addEventListener('click', ev => {
    const url = 'http://localhost:8080' + '/' + roomId.value;
    window.location.href = url;
    socket.emit('send_offer', url)
})

socket.on('offer', function (data) {
    console.log(data);
    const isConfirmed  = window.confirm(data);
    if (isConfirmed) {
        window.location.href = data;
    }
})