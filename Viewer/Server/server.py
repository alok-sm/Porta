import json
import os

from flask import request
from flask import Flask
from flask import jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import urllib.request
from collections import Counter

from Commons.constants import viewserver_host
from Commons.constants import viewserver_port
from Commons.constants import logsDir


def get_basepath(url):
    original = urlparse(url)
    return original.scheme + "://" + original.netloc + original.path


class ViewServer:
    def __init__(self, log_path):
        with open(log_path) as events_file:
            self.log = json.load(events_file)

        for i in range(len(self.log['events'])):
            self.log['events'][i]['index'] = i

        for event in self.log['events']:
            if event['_eventType'] != 'toolchainEvent':
                continue

            previous_mouse_positions = [
                event['cssPath'] for event in self.log['events'][event['index']::-1]
                if event['_eventType'] == 'mouseEnter'
            ]

            if any(previous_mouse_positions):
                event['cssPath'] = previous_mouse_positions[0]



        self.flask_app = Flask(__name__)
        CORS(self.flask_app)
        self.heatmap_start = 0
        self.heatmap_end = 0
        self.changed = True

        def get_heatmap():
            css_path_counts = dict(Counter([
                event['cssPath'] for event in self.log['events']
                if  event['timestamp'] >= self.heatmap_start and
                    event['timestamp'] <= self.heatmap_end and
                    event['_eventType'] == 'mouseEnter' and
                    get_basepath(event['tab']['url']) == get_basepath(self.log['tutorial_website'])
            ]))

            if len(css_path_counts) == 0:
                return {}

            else:
                max_count = max(css_path_counts.items(), key=lambda k: k[1])[1]
                return {k: round(float(v) / max_count * 0.7, 2) for k, v in css_path_counts.items()}

        def get_toolchain_events(returnCodeCheck):
            toolchain_events = [
                event for event in self.log['events']
                if  event['timestamp'] >= self.heatmap_start and
                    event['timestamp'] <= self.heatmap_end and
                    event['_eventType'] == 'toolchainEvent' and
                    returnCodeCheck(event['returnCode'])
            ]

            return toolchain_events

        @self.flask_app.route('/set_bounds', methods=['GET'])
        def set_heatmap_bounds():
            self.changed = True
            self.heatmap_start = float(request.args['start'])
            self.heatmap_end = float(request.args['end'])
            return jsonify({'success': True})

        @self.flask_app.route('/get_overlay_params', methods=['GET'])
        def get_overlay_params():
            payload = {'changed': self.changed}
            if self.changed:
                payload['heatmap'] = get_heatmap()
                payload['errors'] = get_toolchain_events(lambda return_code: return_code != 0)
                payload['warnings'] = get_toolchain_events(lambda return_code: return_code == 0)
                self.changed = False
            return jsonify(payload)

        @self.flask_app.route('/get_bounds', methods=['GET'])
        def get_bounds():
            print(self.log['events'][0])
            return jsonify([
                self.log['events'][0]['timestamp'],
                self.log['events'][-1]['timestamp']
            ])

        @self.flask_app.route('/proxy', methods=['GET'])
        def proxy():
            url = request.args['url']
            with urllib.request.urlopen(url) as response:
                return response.read()



    def start(self):
        self.flask_app.run(host=viewserver_host, port=viewserver_port, ssl_context='adhoc')


def main():
    global events
    import sys
    if len(sys.argv) < 2:
        print('no recording_name')
        return

    log_path = os.path.join(logsDir, '{}.json'.format(sys.argv[1]))
    viewserver = ViewServer(log_path)
    viewserver.start()


if __name__ == '__main__':
    main()
