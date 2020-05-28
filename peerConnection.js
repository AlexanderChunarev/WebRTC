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

    const peer1 = new Peer({
        trickle: false,
        stream: stream
    });

    const peer2 = new Peer({
        trickle: false,
        stream: stream
    });

    peer1.on('signal', function (data) {
        socket.emit('send_id', JSON.stringify(data));
    })

    peer2.on('signal', function (data) {
        socket.emit('send_id', JSON.stringify(data));
    })

    socket.on('id', function (data) {
        peer.signal(JSON.parse(data))
    })

    peer.on('signal', function (data) {
        socket.emit('send_id', JSON.stringify(data));
    })

    peer.on('stream', function (stream) {
        remoteVideo.srcObject = stream
        remoteVideo.play()
    })
})