let username = document.getElementById('user').innerText
let socket = io.connect('http://' + document.domain + ':' + location.port);
//let userlist = [];
var roomlist = ["general"];
//let userlist = ["kelsey", "justin", "nick", "matt"]
let currentroom = "general";

let allmessages = { 'username': [], 'message': [], 'destination': []}


function roomsInitialState() {
    let new_group_chat_text = '<div><input type="text" id="newGroupChatText"></div>'
    let new_group_chat_button = '<div><input type="button" value="+" onclick="newGroupChat()"></div>'
    $('#chatRoomList').append(new_group_chat_text)
    $('#chatRoomList').append(new_group_chat_button)
    //addChatroom(roomlist[0])
}

function newGroupChat() {
    let new_chat = $('#newGroupChatText').val()
    roomlist.push(new_chat)

    socket.emit('new chat', {
        room: currentroom,
    })


    addChatroom(roomlist[roomlist.length-1])
}


roomsInitialState();

function addChatroom(theroom) {
    console.log(theroom)
    let temp = '<div><input type="button" class="leftpanelitem" id="room_name"  value="room_name" onclick="switchRooms(this.value)"></div>'
    temp = temp.replace("room_name", theroom);
    temp = temp.replace("room_name", theroom);
    $('#chatRoomList').append( temp );
}

function switchRooms (val) {
    $('#chatWindow').empty();
    currentroom = val;
    $('#chattingIn').text("Now chatting in: " + currentroom);
    socket.emit('alt join', {
        username: username,
        room: currentroom
    })
    printMessagesToChat();
}

function printMessagesToChat() {
    console.log("gonna print some shit")
    $('#chatWindow').empty();
    for(let i = 0; i < allmessages['username'].length; i++) {
        if(currentroom === allmessages['destination'][i])
            $('#chatWindow').append( "<p>" + allmessages['username'][i] + ": " + allmessages['message'][i] + "</p>" );
        else
            console.log("nope")
    }
}

function updateUserlist (userlist) {
    $('#userList').empty();

    let alreadySeen = [];

    for(let i = 0; i < userlist.length; i++){
        if(alreadySeen.includes(userlist[i]) === false){
            let theuser = userlist[i];
            let temp = '<div><input type="button" class="leftpanelitem" id="user_name"  value="user_name" onclick="switchRooms(this.value)"></div>'
            temp = temp.replace("user_name", theuser);
            temp = temp.replace("user_name", theuser);
            $('#userList').append( temp );
        }
    }
}

function updateRoom (userlist) {
    $('#chatRoomList').empty();
    roomsInitialState();

    let alreadySeen = [];

    for(let i = 0; i < userlist.length; i++){
        if(alreadySeen.includes(userlist[i]) === false){
            alreadySeen.push(userlist[i]);
            addChatroom(userlist[i]);
        }
        else {
            console.log("already seen");
        }
    }
}

socket.on('connect', () => {
    socket.emit('join', {
        username: username,
        room: currentroom
    })
})

document.getElementById('submit').onclick = function () {
    let new_message = document.getElementById('msg').value

    console.log("submit clicked")
    socket.emit('send message', {
        username: username,
        message: new_message,
        destination: currentroom
    })
}

socket.on('send userlist', function (msg) {
    updateUserlist(msg['username']);
    updateRoom(msg['roomname']);
    console.log(msg['username'].length);
})

socket.on('send response', function (msg) {
    //message_list.push(msg.username + ": " + msg.message)
    allmessages['username'].push(msg.username);
    allmessages['message'].push(msg.message);
    allmessages['destination'].push(msg.destination);

    printMessagesToChat();
})

socket.on('send roomlist', function (msg) {
    console.log(msg);
})