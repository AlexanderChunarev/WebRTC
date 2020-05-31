const createRoom = document.getElementById('create');
const roomId = document.getElementById('roomIdInput');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);

createRoom.addEventListener('click', () => {
    const url = BASE_URL + '/' + roomId.value;
    socket.emit('send_offer', url)
})

socket.on('offer', function (data) {
    const isConfirmed = window.confirm(data);
    console.log(data)
    if (isConfirmed) {
        socket.emit('send_confirmed_offer', data)
        navigateTo(data)
    }
})

socket.on('confirmed_offer', function (data) {
    navigateTo(data + '#init');
})

function navigateTo(url) {
    window.location.href = url;
}
