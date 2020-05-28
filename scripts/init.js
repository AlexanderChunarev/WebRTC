const constraints = window.constraints = {
    audio: true,
    video: true
};

async function initStream() {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

function handleSuccess(stream) {
    localVideo.srcObject = stream
    localVideo.play()
}

initStream().then(stream => handleSuccess(stream))
