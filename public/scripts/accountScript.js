const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const listContainer = document.getElementById('container');
let currentUser;
let users = [];

window.onbeforeunload = () => {
    socket.emit('on-user-remove', currentUser._id);
    setActivityStatus(currentUser);
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

socket.on('offer', function (data) {
    console.log("offer")
    const isConfirmed = window.confirm(data);
    if (isConfirmed) {
        const roomUrl = generateUrl('room', 'id', new Date().getTime());
        socket.emit('send_confirmed_offer', {senderID: data.senderID, url: roomUrl.href})
        navigateTo(roomUrl)
    }
})

socket.on('confirmed_offer', function (data) {
    navigateTo(data + '#init');
})

socket.on('add-active-user', function (user) {
    users.push(user);
    show(users);
})

socket.on('remove-user', function (userID) {
    users = users.filter(user => user._id !== userID);
    show(users);
})

function addUser(user) {
    let el = document.createElement('div');
    el.innerHTML = itemHtml;
    el.getElementsByTagName('p')[0].innerHTML = user.name;
    el.getElementsByTagName('button')[0].addEventListener('click', () => {
        console.log("send offer")
        socket.emit('send_offer', {senderID: currentUser._id, remoteID: user._id});
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
