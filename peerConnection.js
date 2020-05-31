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
        socket.emit('send_id', data);
    })

    socket.on('id', function (data) {
        peer.signal(data)
    })

    peer.on('stream', function (stream) {
        remoteVideo.srcObject = stream
        remoteVideo.play()
    })
}

// function connection(stream) {
//     const localPeer = new Peer({
//         initiator: true,
//         trickle: false,
//         stream: stream
//     });
//
//     const remotePeer = new Peer({
//         trickle: false,
//         stream: stream
//     });
//
//     localPeer.on('signal', function (data) {
//         console.log(data)
//         remotePeer.signal(data);
//     })
//
//     remotePeer.on('signal', function (data) {
//         console.log(data)
//         localPeer.signal(data);
//     })
//
//     // localPeer.on('stream', function (stream) {
//     //     console.log('starting connection local user ...')
//     //     localVideo.srcObject = stream;
//     //     localVideo.play();
//     // })
//
//     remotePeer.on('stream', function (stream) {
//         console.log('starting connection remote user ...')
//         remoteVideo.srcObject = stream;
//         remoteVideo.play();
//     })
// }

applyConnection()
