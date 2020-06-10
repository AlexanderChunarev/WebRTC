const Peer = require('simple-peer');
const constraints = window.constraints = {
    audio: true,
    video: true
};
const chatBlock = document.getElementById('chat');
const sendMessage = document.getElementById('send-message');
const messageInput = document.getElementById('message-text');

function applyConnection() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function success(stream) {
            connection(stream)
        })
        .catch(function (err) {
            console.log(err);
        })
}

function connection(stream) {
    const peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
    });

    peer.on('signal', data => {
        socket.emit('send_id', {peerID: data, roomID: getParameter('id')});
    });

    socket.on('id', function (data) {
        peer.signal(data)
    });

    peer.on('stream', stream => {
        remoteVideo.srcObject = stream
        remoteVideo.play()
    });

    peer.on('data', data => {
        appendMessageHtml(data, 'candidate-chat-message');
    });

    sendMessage.addEventListener('click', () => {
        appendMessageHtml(messageInput.value, 'my-chat-message')
        peer.send(messageInput.value);
        messageInput.value = '';
    });

    messageInput.addEventListener("keyup", e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            sendMessage.click();
        }
    })
}

function appendMessageHtml(message, className = '') {
    let element = document.createElement('div');
    element.className = className;
    element.innerHTML = message;
    chatBlock.appendChild(element);
}

socket.on('connected_to_room', data => {
    console.log(data)
})

socket.emit('room', getParameter('id'));

applyConnection()
