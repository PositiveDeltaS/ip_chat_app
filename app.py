from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

connected_users = { 'username': [], 'roomname': []}


messageList = {'username': [], 'message': [], 'destination': []}
serverState = {'username': [], 'roomname': ['general'] }
userListArray = []
roomListArray = ["general"]

@app.route('/')
def index():
    return render_template('./index.html')


@app.route('/chat', methods=['GET'])
def chat():
    the_username = (request.args.get('id'))
    return render_template('ChatApp.html', username=the_username)


@socketio.on('join server')
def on_join(data):
    print ("user joined room...")
    join_room('general')
    if data['username'] not in serverState['username']:
        serverState['username'].append(data['username'])
    socketio.emit('send server state', serverState)


@socketio.on('new chat')
def new_chat(data):
    print ("user created room: " + data['roomname'])
    if data['roomname'] not in serverState['roomname']:
        serverState['roomname'].append(data['roomname'])
    socketio.emit('send server state', serverState)


@socketio.on('send message')
def new_message(data):
    messageList['username'].append(data['username'])
    messageList['message'].append(data['message'])
    messageList['destination'].append(data['destination'])
    socketio.emit('send message response', messageList)

@socketio.on('leave server')
def leave_server(data):
    leave_room('general')


if __name__ == '__main__':
    socketio.run(app, debug = True)