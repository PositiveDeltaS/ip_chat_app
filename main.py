from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('./ChatApp.html')


@app.route('/chat', methods=['GET'])
def chat():
    the_username = (request.args.get('id'))
    return render_template('ChatApp.html', username=the_username)


@socketio.on('send message')
def event_handler(json, methods=['GET', 'POST']):
    socketio.emit('send response', json)


if __name__ == '__main__':
    socketio.run(app, debug = True)