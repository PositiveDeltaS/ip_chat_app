from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

roomlist = []
connected_users = { 'username': [], 'roomname': []}


@app.route('/')
def index():
    return render_template('./index.html')


@app.route('/chat', methods=['GET'])
def chat():
    the_username = (request.args.get('id'))
    return render_template('ChatApp.html', username=the_username)


@socketio.on('join')
def on_join(data):
    print ("user joined room...")
    join_room(data['room'])
    connected_users['username'].append(data['username'])
    connected_users['roomname'].append(data['room'])
    print(data['username'] + ' has entered room: ' + data['room'])
    socketio.emit('send userlist', connected_users)

@socketio.on('send message')
def event_handler(json, methods=['GET', 'POST']):
    socketio.emit('send response', json)

@socketio.on('new chat')
def create_chat(data):
    if data.room not in roomlist:
        print("added " + data.room + " to room list")
        roomlist.append(data.room)
    socketio.emit('send roomlist', data)

if __name__ == '__main__':
    socketio.run(app, debug = True)