const socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('LT');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
});

socket.on('newLocationMessage', function({from, url, createdAt}) {
    let formattedTime = moment(createdAt).format('LT');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        url,
        from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
});


$('#message-form').on('submit', function (e) {
    e.preventDefault();
    let messageAuthor = $('[name=sender]');
    let messageTextbox = $('[name=message]');
    socket.emit('createMessage', {
        from: messageAuthor.val(),
        text: messageTextbox.val()
    }, function () {
        messageAuthor.val('');
        messageTextbox.val('');
    })
});

let locationButton = $('#send-location');

locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by yout browser =(');
    }
    
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        locationButton.removeAttr('disabled').text('Send Location');
    }, function () {
        alert('Unable to fetch location!')
        locationButton.removeAttr('disabled').text('Send Location');
    })
});