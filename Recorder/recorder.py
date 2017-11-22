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

@atexit.register
def exit():
    global recording_name
    log_filepath = os.path.join(logsDir, '{}.jsonlog'.format(recording_name))
    with open(log_filepath, 'w') as log_file:
        json.dump({
            'recording_name': recording_name,
            'events': events,

        }, log_file, indent=4, sort_keys=True)

    clean()


def clean():
    utils.clean_bashrc()
    utils.clean_directories()
    utils.stop_chrome()


def start(args, restore):
    global recording_name

    if len(args) < 2:
        print('no recording_name given')
        return

    recording_name = args[1]

    utils.setup_directories()
    utils.setup_bashrc()
    generate_all_shims()
    utils.restart_bash()
    utils.restart_chrome_with_extension(restore)

    log_server = LogServer(events)
    log_server.start()


def record(args):
    if len(args) < 2:
        print('start / clean?')
        return
    if args[1] == 'start':
        start(args[1:], restore=False)
    elif args[1] == 'start-restore':
        start(args[1:], restore=True)
    elif args[1] == 'clean':
        clean()


if __name__ == '__main__':
    record(sys.argv)
