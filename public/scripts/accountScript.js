const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const listContainer = document.getElementById('container');
const localVideo = document.getElementById('prepareLocalVideo');
let currentUser;
let users = [];
let options = {
    video: true,
    audio: true
}

window.onbeforeunload = () => {
    socket.emit('on-user-remove', currentUser._id);
    setActivityStatus(currentUser);
    sessionStorage.setItem('local_options', JSON.stringify(options));
}

function init() {
    const uID = getParameter('u');
    postData(API_SELECT_URL, {_id: uID})
        .then(res => {
            currentUser = res[0];
            setActivityStatus(currentUser)
            socket.emit('on-user-added', currentUser);
        });
    getData(API_URL)
        .then(res => {
            users = res.filter(user => user._id !== uID)
            show(users);
        });
}

socket.on('offer', function (user) {
    $('#myModal').modal('show');
    document.getElementById('modalBody').innerHTML = `${user.name} wants to call you`
    document.getElementById('confirmOffer').addEventListener('click', () => {
        const roomUrl = generateUrl('room', 'id', new Date().getTime());
        socket.emit('send_confirmed_offer', {senderID: user.senderID, url: roomUrl.href})
        navigateTo(roomUrl);
    })
})

socket.on('confirmed_offer', function (url) {
    navigateTo(url + '#init');
})

socket.on('add-active-user', function (user) {
    users.push(user);
    show(users);
})

socket.on('remove-user', function (userID) {
    users = users.filter(user => user._id !== userID);
    show(users);
})

turnOnOfVideo.onclick = function () {
    update(turnOnOfVideoImage, {
        tagFrom: TURN_ON_VIDEO,
        tagTo: TURN_OF_VIDEO,
        imagePathFrom: '/images/no-video-conference.png',
        imagePathTo: '/images/video-conference.png'
    });

    let videoStream = localStream.getTracks().find(mediaStreamTrack => mediaStreamTrack.kind === 'video');
    videoStream.enabled = !videoStream.enabled;
    options.video = videoStream.enabled;
}

turnOnOfAudio.onclick = function () {
    update(turnOnOfAudioImage, {
        tagFrom: TURN_ON_AUDIO,
        tagTo: TURN_OF_AUDIO,
        imagePathFrom: '/images/rsz_mute_1.png',
        imagePathTo: '/images/mic.png'
    });

    let audioStream = localStream.getTracks().find(mediaStreamTrack => mediaStreamTrack.kind === 'audio');
    audioStream.enabled = !audioStream.enabled;
    options.audio = audioStream.enabled;
}

function addUser(user) {
    let el = document.createElement('div');
    el.innerHTML = itemHtml;
    el.getElementsByTagName('p')[0].innerHTML = user.name;
    el.getElementsByTagName('button')[0].addEventListener('click', () => {
        socket.emit('send_offer', {name: currentUser.name, senderID: currentUser._id, remoteID: user._id});
    })
    listContainer.appendChild(el);
}

function show(users) {
    listContainer.innerHTML = '';
    if (users.length > 0) {
        users.forEach(user => addUser(user));
    }
}

init()
