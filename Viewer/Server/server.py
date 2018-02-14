from flask import send_from_directory
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import json
import sys
import os

app = Flask(__name__)
CORS(app)
log = None

def preprocess_log(raw_log):
    events = raw_log['events']
    for i, event in enumerate(events):
        if(not event['_eventType'] == 'mouseEnter'):
            reverse_events = events[i::-1] + events[-1:i:-1]
            for revent in reverse_events:
                if(revent['_eventType'] == 'mouseEnter'):
                    event['cssPath'] = revent['cssPath']

    return raw_log

@app.route('/static/<path:path>')
def file(path):
    return send_from_directory('file', path)

@app.route('/url')
def get_url():
    return jsonify({'url': log['tutorial_website']})

@app.route('/log')
def get_log():
    return jsonify(log['events'])

def main():
    global log
    log_name = sys.argv[1]
    path = os.path.expanduser('~/.portaLogs/{}.json'.format(log_name))
    log = preprocess_log(json.load(open(path)))
    app.run(host='0.0.0.0', port=3000, debug=True)

if __name__ == '__main__':
    main()
