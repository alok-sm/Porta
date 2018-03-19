import atexit
import json

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

from Commons.constants import logserver_host
from Commons.constants import logserver_port

from urllib.parse import urlparse

def to_be_logged(data, tutorial_website):
    if _eventType in ['mouseEnter', 'selectionChange', 'scrollEnd']:
        tutorial_url = urlparse(tutorial_url)
        event_url = urlparse(data['tab']['url'])
        return tutorial_url.netloc == event_url.netloc and tutorial_url.path == event_url.path

    return True
        

class LogServer:
    def __init__(self, events, tutorial_website):
        self.events = events
        self.tutorial_website = tutorial_website
        self.flask_app = Flask(__name__)
        CORS(self.flask_app)

        @self.flask_app.route('/log', methods=['POST'])
        def log():
            data = request.get_json()
            if to_be_logged(data, self.tutorial_website):
                self.events.append(data)
            return jsonify({'status': 'success'})

    def start(self):
        self.flask_app.run(host=logserver_host, port=logserver_port, threaded=True)


def main():
    global events
    logserver = LogServer(events, 'http://example.com')
    logserver.start()


if __name__ == '__main__':
    main()
