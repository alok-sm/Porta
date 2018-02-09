from flask import send_from_directory
from flask import Flask
from flask_cors import CORS

# from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
# socketio = SocketIO(app)

@app.route('/static/<path:path>')
def file(path):
    return send_from_directory('file', path)

# @socketio.on('toMain', namespace='/socketio')
# def to_main(message):
#     emit('my response', {'data': message['data']})



app.run(host='0.0.0.0', port='3000')