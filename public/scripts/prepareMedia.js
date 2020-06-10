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

turnOnOfVideo.onclick = function () {
    if (turnOnOfVideoImage.alt === TURN_ON_VIDEO) {
        turnOnOfVideoImage.src = '/images/no-video-conference.png';
        turnOnOfVideoImage.alt = TURN_OF_VIDEO;
    } else if (turnOnOfVideoImage.alt === TURN_OF_VIDEO) {
        turnOnOfVideoImage.src = '/images/video-conference.png';
        turnOnOfVideoImage.alt = TURN_ON_VIDEO;
    }

    localStream.getTracks().forEach((mediaStreamTrack) => {
        if (mediaStreamTrack.kind === 'video') {
            mediaStreamTrack.enabled = !mediaStreamTrack.enabled;
        }
    });
}

turnOnOfAudio.onclick = function () {
    if (turnOnOfAudioImage.alt === TURN_ON_AUDIO) {
        turnOnOfAudioImage.src = '/images/rsz_mute_1.png';
        turnOnOfAudioImage.alt = TURN_OF_AUDIO;
    } else if (turnOnOfAudioImage.alt === TURN_OF_AUDIO) {
        turnOnOfAudioImage.src = '/images/mic.png';
        turnOnOfAudioImage.alt = TURN_ON_AUDIO;
    }

    localStream.getTracks().forEach((mediaStreamTrack) => {
        if (mediaStreamTrack.kind === 'audio') {
            mediaStreamTrack.enabled = !mediaStreamTrack.enabled;
        }
    });
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