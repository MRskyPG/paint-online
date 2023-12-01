const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const httpserver = http.createServer(app);
const io = new socketio.Server(httpserver);

app.use(express.static(__dirname + '/public'));

const PORT = 80;
httpserver.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
})


let userCount = 0;

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);

    userCount++;
    io.emit('update user count', userCount); // send everyone amount of users

    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
        userCount--;
        io.emit('update user count', userCount);
    });

    socket.on('start drawing', (obj) => {
        //step 2: recv from one socket and send to everyone except emitting socket. (look at step 1 in index.js)
        socket.broadcast.emit('start drawing', obj);

    })

    socket.on('clear canvas', (obj) => {
        socket.broadcast.emit('clear canvas', obj)
    })



});