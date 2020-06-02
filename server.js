const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 8080;
const dbClient = require('./db/databaseFactory');

app.all('/', function(req, res) {
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

app.get('/room/:id', function (request, res) {
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
    console.log("starting remove....")
    dbClient.remove(req.params.id, res);
});

io.on('connection', function (socket) {
    socket.on('send_offer', function (data) {
        socket.broadcast.emit('offer', data);
    });

    socket.on('send_confirmed_offer', function (data) {
        socket.broadcast.emit('confirmed_offer', data);
    });

    socket.on('send_id', function (data) {
        socket.broadcast.emit('id', data);
    });
});

dbClient.connect().then(result => {
    if (result) {
        http.listen(port, function () {
            console.log('Server running on port: ' + port)
        });
    }
})

