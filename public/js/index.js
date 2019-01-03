const socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('New message received', message);
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
});


$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: $('[name=sender]').val(),
        text:$('[name=message]').val()
    }, function (knowledge) {
        console.log(`Got it: ${knowledge}`);
    })

    $('[name=sender]').val('');
    $('[name=message]').val('');
})