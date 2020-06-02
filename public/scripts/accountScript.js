const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const createRoom = document.getElementById('create');
const roomId = document.getElementById('roomIdInput');
const roomUrl = BASE_URL + '/room';

createRoom.addEventListener('click', () => {
    const url = roomUrl + '/' + roomId.value;
    socket.emit('send_offer', url)
})

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    deleteUser(API_URL, getParameter('u'))
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
});

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