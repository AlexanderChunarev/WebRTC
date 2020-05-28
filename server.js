const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const port = 8080;

app.get('/', function (request, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/:id', function (request, res) {
    res.sendFile(path.join(__dirname, 'public/room.html'));
});

app.use(express.static('public'));

app.use('/scripts', express.static(__dirname + '/scripts'));

app.use('/images', express.static(__dirname + '/images'));

io.on('connection', function (socket) {
    socket.on('send_id', function (data) {
        socket.broadcast.emit('id', data);
    });
});

http.listen(port, function () {
    console.log('server running on port ' + port)
});
