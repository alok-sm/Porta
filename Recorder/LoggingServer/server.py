import json
from threading import Lock

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

from Recorder.Commons.constants import logserver_host
from Recorder.Commons.constants import logserver_port


class LogServer:
    def __init__(self, log_file):
        self.log_file = log_file
        self.flask_app = Flask(__name__)
        self.log_lock = Lock()
        CORS(self.flask_app)

        @self.flask_app.route('/log', methods=['POST'])
        def log():
            data = request.get_json()
            self.atomic_log_data(data)
            return jsonify({'status': 'success'})

        @self.flask_app.route('/browser_log', methods=['POST'])
        def browser_log():
            data = request.form
            self.atomic_log_data(data)
            return jsonify({'status': 'success'})

    def atomic_log_data(self, data):
        self.log_lock.acquire()
        print(json.dumps(data), file=self.log_file)
        self.log_file.flush()
        self.log_lock.release()

    def start(self):
        self.flask_app.run(host=logserver_host, port=logserver_port, threaded=True)


def main():
    import sys
    if len(sys.argv) < 2:
        print('no recording name')
        sys.exit()
    else:
        with open(sys.argv[1], 'w') as log_file:
            logserver = LogServer(log_file)
            logserver.start()


if __name__ == '__main__':
    main()
