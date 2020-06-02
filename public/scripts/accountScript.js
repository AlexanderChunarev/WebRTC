const BASE_URL = window.location.origin;
const socket = io.connect(BASE_URL);
const listContainer = document.getElementById('container');
const uID = getParameter('u');
let request;


window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    deleteUser(API_URL, uID)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
});

fetchUsers(API_URL).then(res => {
    socket.emit('set_user', uID)
    res.filter(user => user._id !== uID).forEach(user => addUser(user))
});

socket.on('offer', function (data) {
    const isConfirmed = window.confirm(data);
    if (isConfirmed) {
        const roomUrl = generateUrl('room','id' ,new Date().getTime());
        socket.emit('send_confirmed_offer', {senderID: data.senderID, url: roomUrl.href})
        navigateTo(roomUrl)
    }
})

socket.on('confirmed_offer', function (data) {
    navigateTo(data + '#init');
})

const itemHtml = `
    <div class="card card-signin">
        <div class="card-body row">
            <div class="col-8">
                <p class="card-text h3">Vlad</p>
            </div>
            <div class="col-4 text-right">
                <button class="btn btn-success">Call</button>
            </div>
        </div>
    </div>`

function addUser(user) {
    let el = document.createElement('div');
    el.innerHTML = itemHtml;
    el.getElementsByTagName('p')[0].innerHTML = user.name;
    el.getElementsByTagName('button')[0].addEventListener('click', () => {
        request = {senderID: uID, remoteID: user._id}
        socket.emit('send_offer', request)
    })
    listContainer.appendChild(el);
}

document.getElementById('refresh').addEventListener('click', ev => {
    listContainer.innerHTML = '';
    fetchUsers(API_URL).then(res => {
        res.filter(user => user._id !== uID).forEach(user => {
            addUser(user)
        })
    });
});