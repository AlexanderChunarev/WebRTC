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
    dbClient.getActiveUsers(res);
});

app.post('/db/users/select', function (req, res) {
    dbClient.getUser(req.body, res);
});

app.post('/db/users/update/status', function (req, res) {
    dbClient.setStatus(req.body, res);
});

app.post('/db/users', function (req, res) {
    const user = {
        name: req.body.name,
        password: req.body.password,
        isActive: false
    };
    dbClient.insert(user, res);
});

app.delete('/db/users/:id', function (req, res) {
    dbClient.remove(req.params.id, res);
});

io.on('connection', function (socket) {
    socket.on('on-user-added', function (user) {
        users.push({id: user._id, socketID: socket.id});
        socket.broadcast.emit('add-active-user', user);
    })

    socket.on('on-user-remove', function (userID) {
        users.splice(users.findIndex((user) => user.id === userID), 1)
        socket.broadcast.emit('remove-user', userID);
    })

    socket.on('send_offer', function (data) {
        const socketID = users.find(user => user.id === data.remoteID).socketID;
        if (socketID !== null) {
            socket.broadcast.to(socketID).emit('offer', data);
        }
    });

    socket.on('send_confirmed_offer', function (data) {
        const socketID = users.find(user => user.id === data.senderID).socketID
        socket.broadcast.to(socketID).emit('confirmed_offer', data.url);
    });

    socket.on('send_rejected_offer', function (data) {
        const socketID = users.find(user => user.id === data.senderID).socketID;
        socket.broadcast.to(socketID).emit('rejected_offer', data.name);
    });

    socket.on('room', function (room) {
        socket.join(room);
        socket.to(room).emit('connected_to_room', 'Connected')
    });

    socket.on('send_id', function (data) {
        socket.to(data.roomID).broadcast.emit('id', data.peerID);
    });

    socket.on('media', function (data) {
        socket.to(data.roomID).broadcast.emit('media-constraints', data.options);
    });
});

dbClient.connect().then(result => {
    if (result) {
        http.listen(port, function () {
            console.log('Server running on port: ' + port)
        });
    }
})

