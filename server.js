const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 8080;
const dbClient = require('./db/databaseFactory');
let users = [];

app.all('/', function (req, res) {
    res.redirect('/login');
});

app.use(express.static('public'));

app.use('/scripts', express.static(__dirname + '/scripts'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/login', function (request, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/account', function (request, res) {
    res.sendFile(path.join(__dirname, 'public/account.html'));
});

app.get('/room', function (request, res) {
    res.sendFile(path.join(__dirname, 'public/room.html'));
});

app.get('/db/users', function (req, res) {
    dbClient.getUsers(res);
});

app.post('/db/users', function (req, res) {
    const user = {
        name: req.body.name
    };
    dbClient.insert(user, res);
});

app.delete('/db/users/:id', function (req, res) {
    dbClient.remove(req.params.id, res);
});

io.on('connection', function (socket) {
    socket.on('set_user', function (userID) {
        users.push({id: userID, socketID: socket.id})
    })

    socket.on('send_offer', function (data) {
        const socketID = users.find(user => user.id === data.remoteID).socketID
        socket.broadcast.to(socketID).emit('offer', data);
    });

    socket.on('send_confirmed_offer', function (data) {
        const socketID = users.find(user => user.id === data.senderID).socketID
        socket.broadcast.to(socketID).emit('confirmed_offer', data.url);
    });

    socket.on('room', function (room) {
        console.log(room)
        socket.join(room);
        socket.to(room).emit('connected_to_room', 'Connected')
    });

    socket.on('send_id', function (data) {
        socket.to(data.roomID).broadcast.emit('id', data.peerID);
    });
});

dbClient.connect().then(result => {
    if (result) {
        http.listen(port, function () {
            console.log('Server running on port: ' + port)
        });
    }
})

