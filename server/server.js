const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log(' New User connected');
    
    socket.emit('newMessage', 
        generateMessage('Admin', 'Welcome to the Chat app'))
    
    socket.broadcast.emit('newMessage', 
        generateMessage('Admin', 'New User Joined'));

    socket.on('createMessage', (message) => {
        console.log('created message', message);

        io.emit('newMessage', 
            generateMessage(message.from, message.text));
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