from flask import send_from_directory
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import json
import sys
import os

class ViewServer:
    def __init__(self, log):
        self.log = log
        self.app = Flask(__name__)
        CORS(self.app)

        @self.app.route('/static/<path:path>')
        def file(path):
            return send_from_directory('file', path)

        @self.app.route('/url')
        def get_url():
            return jsonify({'url': log['tutorial_website']})

        @self.app.route('/log')
        def get_log():
            return jsonify(log['events'])

    def start(self):
        self.app.run(host='0.0.0.0', port=3000, threaded=True)


def main():
    path = os.path.expanduser('~/.portaLogs/{}.json'.format(sys.argv[1]))
    view_server = ViewServer(json.load(open(path)))
    view_server.start()


if __name__ == '__main__':
    main()
