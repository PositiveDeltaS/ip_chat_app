from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

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
    username = data['username']
    room = data['room']

    join_room(room)
    connected_users['username'].append(username)
    connected_users['roomname'].append(room)

    print(connected_users)
    print(username + ' has entered room: ' + room)

@socketio.on('send message')
def event_handler(json, methods=['GET', 'POST']):
    socketio.emit('send response', json)


if __name__ == '__main__':
    socketio.run(app, debug = True)