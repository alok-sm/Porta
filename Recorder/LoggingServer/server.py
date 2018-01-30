import atexit
import json

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

from Commons.constants import logserver_host
from Commons.constants import logserver_port

events = []

@atexit.register
def at_exit():
    print(json.dumps(events, indent=4, sort_keys=True))


class LogServer:
    def __init__(self, events):
        self.events = events
        self.flask_app = Flask(__name__)
        CORS(self.flask_app)

        @self.flask_app.route('/log', methods=['POST'])
        def log():
            data = request.get_json()
            self.events.append(data)
            return jsonify({'status': 'success'})

    def start(self):
        self.flask_app.run(host=logserver_host, port=logserver_port, threaded=True)


def main():
    global events
    logserver = LogServer(events)
    logserver.start()


if __name__ == '__main__':
    main()
