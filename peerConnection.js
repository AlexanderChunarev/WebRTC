const getUserMedia = require('getusermedia');
const Peer = require('simple-peer');
const socket = io.connect('http://localhost:8080');

getUserMedia(constraints, function (err, stream) {
    if (err) console.log(err);

    const peer = new Peer({
        initiator: location.hash === '#initiator',
        trickle: false,
        stream: stream
    });

    socket.on('id', function (data) {
        peer.signal(JSON.parse(data))
    })

    peer.on('signal', function (data) {
        socket.emit('send_id', JSON.stringify(data));
    })

    peer.on('stream', function (stream) {
        const video = document.createElement('video');
        document.body.appendChild(video)
        video.srcObject = stream
        video.play()
    })
})