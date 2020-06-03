const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const listContainer = document.getElementById('container');
let currentUser;
let users = [];

window.addEventListener("unload", function () {
    socket.emit('on-user-remove', currentUser._id);
    deleteUser(API_URL, currentUser._id)
        .then(res => {
            console.log(res);
        });
});

function setCurrentUser(res) {
    const uID = getParameter('u');
    currentUser = res.find(user => user._id === uID);
    socket.emit('on-user-added', currentUser);
}

fetchUsers(API_URL)
    .then(res => {
        setCurrentUser(res);
        users = res.filter(user => user._id !== currentUser._id)
        show(users);
    });

socket.on('offer', function (data) {
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

// document.getElementById('refresh').addEventListener('click', ev => {
//     listContainer.innerHTML = '';
//     fetchUsers(API_URL).then(res => {
//         res.filter(user => user._id !== uID).forEach(user => {
//             addUser(user)
//         })
//     });
// });