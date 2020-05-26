const getUserMedia = require('getusermedia');
const Peer = require('simple-peer');

const constraints = window.constraints = {
    audio: true,
    video: {
        width: { min: 1280 },
        height: { min: 720 }
    }
};

getUserMedia(constraints, function (err, stream) {
    if (err) console.log(err);

    const peer = new Peer({
        initiator: location.hash === '#initiator',
        trickle: false,
        stream: stream
    });

    // document.getElementById('connect').addEventListener('click', function () {
    //     const otherId = JSON.parse(document.getElementById('otherId').value);
    //     peer.signal(otherId)
    // })

    socket.on('id', function (data) {
        const otherId = JSON.parse(document.getElementById('otherId').value);
        peer.signal(otherId)
    })

    peer.on('signal', function (data) {
        document.getElementById('yourId').value = JSON.stringify(data)
        socket.emit('send_id', JSON.stringify(data));
    })

    peer.on('stream', function (stream) {
        const video = document.createElement('video');
        document.body.appendChild(video)
        video.srcObject = stream
        video.play()
    })
})