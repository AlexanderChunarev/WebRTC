const Peer = require('simple-peer');
const constraints = window.constraints = {
    audio: true,
    video: true
};
const chatBlock = document.getElementById('chat');
const sendMessage = document.getElementById('send-message');
const messageInput = document.getElementById('message-text');
const roomID = getParameter('id');
let remoteStream;
let mediaConstraints = {};

function applyConnection() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function success(stream) {
            connection(stream)
        })
        .catch(function (err) {
            console.log(err);
        })
}

function applyLocalOptions() {
    const localOptions = sessionStorage.getItem('local_options');
    if (localOptions !== null) {
        const options = JSON.parse(localOptions);
        if (!options.video) {
            console.log('video')
            turnOnOfVideo.click()
        }
        if (!options.audio) {
            console.log('audio')
            turnOnOfAudio.click()
        }
    }
}

function applyRemoteOptions(stream, mediaConstraints) {
    if (mediaConstraints !== undefined && stream !== undefined) {
        stream.getTracks().forEach((mediaStreamTrack) => {
            if (mediaStreamTrack.kind === 'video' && mediaConstraints.video !== undefined) {
                mediaStreamTrack.enabled = mediaConstraints.video;
            }
            if (mediaStreamTrack.kind === 'audio' && mediaConstraints.audio !== undefined) {
                mediaStreamTrack.enabled = mediaConstraints.audio;
            }
        });
    }
}

function connection(stream) {
    const peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
    });

    peer.on('signal', data => {
        socket.emit('send_id', {peerID: data, roomID: roomID});
    });

    socket.on('id', function (data) {
        peer.signal(data)
    });

    peer.on('stream', stream => {
        remoteVideo.srcObject = stream
        remoteVideo.play()
        remoteStream = stream;
        applyLocalOptions();
        applyRemoteOptions(stream, mediaConstraints);
    });

    peer.on('data', data => {
        appendMessageHtml(data, 'candidate-chat-message');
    });

    window.onbeforeunload = () => {
        peer.destroy();
    }

    peer.on('error', () => {
        window.history.back();
    })

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

socket.on('media-constraints', data => {
    mediaConstraints = data;
    applyRemoteOptions(remoteStream, mediaConstraints);
});

socket.emit('room', getParameter('id'));

turnOnOfVideo.onclick = function () {
    update(turnOnOfVideoImage, {
        tagFrom: TURN_ON_VIDEO,
        tagTo: TURN_OF_VIDEO,
        imagePathFrom: '/images/no-video-conference.png',
        imagePathTo: '/images/video-conference-invert.png'
    });

    let videoStream = localStream.getTracks().find(mediaStreamTrack => mediaStreamTrack.kind === 'video');
    videoStream.enabled = !videoStream.enabled;
    socket.emit('media', {options: {video: videoStream.enabled}, roomID: roomID});
}

turnOnOfAudio.onclick = function () {
    update(turnOnOfAudioImage, {
        tagFrom: TURN_ON_AUDIO,
        tagTo: TURN_OF_AUDIO,
        imagePathFrom: '/images/rsz_mute_1.png',
        imagePathTo: '/images/mic-invert.png'
    });

    let audioStream = localStream.getTracks().find(mediaStreamTrack => mediaStreamTrack.kind === 'audio');
    audioStream.enabled = !audioStream.enabled;
    socket.emit('media', {options: {audio: audioStream.enabled}, roomID: roomID});
}

applyConnection()
