let username = document.getElementById('user').innerText
let message_list = []
let socket = io.connect('http://' + document.domain + ':' + location.port);

var roomlist = ["general"]
let userlist = ["kelsey", "justin", "nick", "matt"]
let currentroom = "general"

let allmessages = { 'username': [], 'message': [], 'destination': []}



function roomsInitialState() {
    let new_group_chat_text = '<div><input type="text" id="newGroupChatText"></div>'
    let new_group_chat_button = '<div><input type="button" value="+" onclick="newGroupChat()"></div>'
    $('#chatRoomList').append(new_group_chat_text)
    $('#chatRoomList').append(new_group_chat_button)
    addChatroom(roomlist[0])
}

function newGroupChat() {
    console.log($('#newGroupChatText').val())
    let new_chat = $('#newGroupChatText').val()
    roomlist.push(new_chat)
    addChatroom(roomlist[roomlist.length-1])
}


roomsInitialState()

function addChatroom(theroom) {
    console.log(theroom)
    let temp = '<div><input type="button" class="leftpanelitem" id="room_name"  value="room_name" onclick="switchRooms(this.value)"></div>'
    temp = temp.replace("room_name", theroom);
    temp = temp.replace("room_name", theroom);
    $('#chatRoomList').append( temp );
}


$('#charRoomList').append()

for(let i = 0; i < userlist.length; i++){
    let theuser = userlist[i]
    console.log(theuser)
    let temp = '<div><input type="button" class="leftpanelitem" id="user_name"  value="user_name" onclick="switchRooms(this.value)"></div>'
    temp = temp.replace("user_name", theuser);
    temp = temp.replace("user_name", theuser);
    $('#userList').append( temp );
}

function switchRooms (val) {
    $('#chatWindow').empty();
    currentroom = val;
    $('#chattingIn').text("Now chatting in: " + currentroom);
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

    console.log("submit clicked")
    socket.emit('send message', {
        username: username,
        message: new_message,
        destination: currentroom
    })
}


socket.on('send response', function (msg) {
    //message_list.push(msg.username + ": " + msg.message)
    allmessages['username'].push(msg.username);
    allmessages['message'].push(msg.message);
    allmessages['destination'].push(msg.destination);

    printMessagesToChat();
})
