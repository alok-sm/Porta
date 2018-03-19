#!/usr/bin/env python3

import atexit
import json
import os
import sys

from Commons.constants import logsDir
from Commons import utils
from Recorder.LoggingServer.server import LogServer
from Recorder.ToolchainMonitor.shim_generator import generate_all_shims

events = []
recording_name = ''
tutorial_website = ''


def preprocess_log(raw_log):
    events = raw_log['events']
    for i, event in enumerate(events):
        if not event['_eventType'] == 'mouseEnter':
            reverse_events = events[i::-1] + events[-1:i:-1]
            for revent in reverse_events:
                if revent['_eventType'] == 'mouseEnter':
                    event['cssPath'] = revent['cssPath']

    return raw_log


def on_exit():
    global recording_name
    log_filepath = os.path.join(logsDir, '{}.json'.format(recording_name))
    log = preprocess_log({
        'recording_name': recording_name,
        'events': events,
        'tutorial_website': tutorial_website
    })

    with open(log_filepath, 'w') as log_file:
        json.dump(log, log_file, indent=4, sort_keys=True)

    clean()


def clean():
    utils.clean_bashrc()
    utils.clean_directories()
    utils.restart_chrome()


def start(args):
    global recording_name, tutorial_website

    if len(args) < 3:
        print('no recording_name or tutorial_website given')
        return

    atexit.register(on_exit)

    recording_name = args[1]
    tutorial_website = args[2]

    utils.setup_directories()
    utils.setup_bashrc()
    generate_all_shims()
    utils.restart_bash()
    utils.restart_chrome_with_recorder_extension(tutorial_website)

    log_server = LogServer(events, tutorial_website)
    log_server.start()


def main():
    if len(sys.argv) < 2:
        print('start / clean?')
        return

    if sys.argv[1] == 'start':
        atexit.register(on_exit)
        start(sys.argv[1:])
    elif sys.argv[1] == 'clean':
        clean()


if __name__ == '__main__':
    main()
