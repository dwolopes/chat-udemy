const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log(' New User connected');
    
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the Chat app'
    })
    
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined',
        createAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('created message', message);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('Client Disconnected');
    })
})

app.use(express.static(publicPath));


// Listen to port 3000
server.listen(port, function () {
    console.log(`Server is up on ${port}`   );
});