const constraints = window.constraints = {
    audio: true,
    video: {
        width: { min: 1280 },
        height: { min: 720 }
    }
};


async function initStream() {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

function handleSuccess(stream) {
    console.log("on success")
    const video = document.createElement('video');
    document.body.appendChild(video)
    video.srcObject = stream
    video.play()
}

initStream().then(stream => handleSuccess(stream))
