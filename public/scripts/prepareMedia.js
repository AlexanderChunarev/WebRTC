let turnOnOfVideoImage = document.getElementById('turn_on_of_video_img');
let turnOnOfAudioImage = document.getElementById('turn_on_of_audio_img');
const turnOnOfVideo = document.getElementById('turn_on_of_video');
const turnOnOfAudio = document.getElementById('turn_on_of_audio');
const TURN_ON_VIDEO = 'turn.on.video';
const TURN_OF_VIDEO = 'turn.of.video';
const TURN_ON_AUDIO = 'turn.on.audio';
const TURN_OF_AUDIO = 'turn.of.audio';
let constraints = window.constraints = {
    audio: true,
    video: true
};
let localStream;

function update(element, options) {
    if (element.alt === options.tagFrom) {
        element.src = options.imagePathFrom;
        element.alt = options.tagTo;
    } else if (element.alt === options.tagTo) {
        element.src = options.imagePathTo;
        element.alt = options.tagFrom;
    }
}

function initStream() {
    return navigator.mediaDevices.getUserMedia(constraints);
}

function handleSuccess(stream) {
    localVideo.srcObject = stream
    localVideo.play()
}

function init() {
    initStream()
        .then(stream => {
            localStream = stream;
            handleSuccess(stream);
        })
        .catch(err => console.log(err));
}

init()