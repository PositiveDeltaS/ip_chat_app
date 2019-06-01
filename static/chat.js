let username = document.getElementById('user').innerText
let message_list = []
let socket = io.connect('http://' + document.domain + ':' + location.port);
let currentroom = "global"

console.log(currentroom)

socket.on('connect', () => {
    socket.emit('join', {
        username: username,
        room: currentroom
    })
})

/*document.getElementById('joinroom').onclick = () => {
    socket.emit('join', {
        username: username,
        room: document.getElementById('roomname').value
    })
}*/


document.getElementById('submit').onclick = function () {

    let new_message = document.getElementById('msg').value


    socket.emit('send message', {
        username: username,
        message: new_message
    })
}



socket.on('send response', function (msg) {
    console.log(msg)

    console.log("hello")
    message_list.push(msg.username + ": " + msg.message)
    //$('#chatWindow').text(message_list);
    $('#chatWindow').append( "<p>" + msg.username + ": " + msg.message + "</p>" );

})
