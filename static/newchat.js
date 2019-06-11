let username = document.getElementById('user').innerText
let socket = io.connect('http://' + document.domain + ':' + location.port);
let activeRooms = [];
let currentroom = ""

socket.on('connect', () => {
    socket.emit('join server', {
        username: username,
    })
});

socket.on('send server state', function (state) {
    activeRooms = state['roomname'];
    console.log("received roomlist");
    console.log(state['roomname'].length);
    listRooms(state['roomname']);
    listUsers(state['username']);
    //listMessages(msg);
});

socket.on('send message response', function (msg) {
    console.log("send msg resp");
    listMessages(msg);
});

initRoomButtons();

function initRoomButtons() {
    $('#chatRoomList').empty();
    let new_group_chat_text = '<div><input type="text" id="newGroupChatText"></div>';
    let new_group_chat_button = '<div><input type="button" value="+" onclick="newGroupChat()"></div>';
    $('#chatRoomList').append(new_group_chat_text);
    $('#chatRoomList').append(new_group_chat_button);
};

function newGroupChat(){
    let newRoom = $('#newGroupChatText').val();
    console.log(newRoom);
    console.log("sending new room name");
    socket.emit('new chat', {
        roomname: newRoom,
    });
}

function listRooms(rooms){
    $('#chatRoomList').empty();
    initRoomButtons();
    for(let i = 0; i < rooms.length; i++){
        let temp = '<div><input type="button" class="leftpanelitem" id="room_name"  value="room_name" onclick="switchRooms(this.value)"></div>'
        temp = temp.replace("room_name", rooms[i]);
        temp = temp.replace("room_name", rooms[i]);
        $('#chatRoomList').append( temp );
    }
}

function listUsers(users) {
    $('#userList').empty();

    for(let i = 0; i < users.length; i++){
        let theuser = users[i];
        let temp = '<div><input type="button" class="leftpanelitem" id="user_name"  value="user_name" onclick="switchRooms(this.value)"></div>'
        temp = temp.replace("user_name", theuser);
        temp = temp.replace("user_name", theuser);
        $('#userList').append( temp );
    }
}

function switchRooms(val) {
    currentroom = val;
    console.log("switching to room: " + currentroom);
    socket.emit('send message', {
        username: "x",
        message: "x",
        destination: "x"
    });
}

document.getElementById('submit').onclick = () => {
    let new_message = document.getElementById('msg').value;
    console.log("submit clicked");
    socket.emit('send message', {
        username: username,
        message: new_message,
        destination: currentroom
    });
}

function listMessages(msg) {
    $('#chatWindow').empty();
    for(let i = 0; i < msg['username'].length; i++) {
        if(currentroom === msg['destination'][i])
            $('#chatWindow').append( "<p>" + msg['username'][i] + ": " + msg['message'][i] + "</p>" );
        else
            console.log("nope")
    }
}

$('#chattingIn').append('<input class="btn btn-primary" type="submit" id="leave_server" value="Leave Server" align="right">')

document.getElementById('leave_server').onclick = function(){
    socket.emit('leave server', {
        username: username,
    });
    location.replace("http://127.0.0.1:5000/")
}