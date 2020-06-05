const Peer = require('simple-peer');
const constraints = window.constraints = {
    audio: true,
    video: true
};

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

    peer.on('signal', function (data) {
        socket.emit('send_id', {peerID: data, roomID: getParameter('id')});
    })

    socket.on('id', function (data) {
        console.log('id: ' + data)
        peer.signal(data)
    })

    peer.on('stream', function (stream) {
        console.log(stream)
        remoteVideo.srcObject = stream
        remoteVideo.play()
    })
}

socket.on('connected_to_room', function (data) {
    console.log(data)
})

socket.emit('room', getParameter('id'));

applyConnection()
