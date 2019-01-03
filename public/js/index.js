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

socket.on('newLocationMessage', function({from, url, createdAt}) {
    let li = $('<li></li>');
    let a = $('<a target="_blank">My Current Location</a>')
    li.text(`${from}:`);
    a.attr('href', url);
    li.append(a);
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
});

let locationButton = $('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by yout browser =(');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location!')
    })
});