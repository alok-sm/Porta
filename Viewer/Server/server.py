from flask import send_from_directory
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import json
import sys
import os

def get_log(name):
    path = os.path.expanduser('~/.portaLogs/{}.json'.format(name))
    log = json.load(open(path))

    for i in range(len(log['events'])):
        log['events'][i]['index'] = i
        if log['events'][i]['_eventType'] == 'toolchainEvent':
            if not log['events'][i]['returnCode'] == 0:
                log['events'][i]['_eventType'] = 'toolchainError'
    return log

class ViewServer:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)

        @self.app.route('/<name>/url')
        def get_url(name):
            return jsonify({'url': get_log(name)['tutorial_website']})

        @self.app.route('/<name>/log')
        def get_named_log(name):
            return jsonify(get_log(name)['events'])

        @self.app.route('/<name>/dump')
        def get_dump(name):
            return jsonify(get_log(name))

        @self.app.route('/<name>/event/<int:index>')
        def get_event_at_index(name, index):
            return jsonify(get_log(name)['events'][index])

    def start(self):
        self.app.run(host='0.0.0.0', port=3000, threaded=False)

def main():
    ViewServer().start()

if __name__ == '__main__':
    main()
