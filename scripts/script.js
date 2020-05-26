const socket = io.connect('http://localhost:8080');
const connect = document.getElementById('connect')

socket.on('id', function (data) {
    document.getElementById('otherId').value = data
})


