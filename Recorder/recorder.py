#!/usr/bin/env python3

import os
import atexit
import sys

from Recorder.Commons import utils
from Recorder.Commons.constants import logsDir
from Recorder.ToolchainMonitor.shim_generator import generate_all_shims
from Recorder.LoggingServer.server import LogServer


@atexit.register
def clean():
    utils.clean_bashrc()
    utils.clean_directories()
    utils.stop_chrome()


def start(args, restore):
    if len(args) < 2:
        print('no recording_name given')
        return

    utils.setup_directories()
    utils.setup_bashrc()
    generate_all_shims()
    utils.restart_bash()
    utils.restart_chrome_with_extension(restore)

    with open(os.path.join(logsDir, '{}.jsonlog'.format(args[1])), 'w') as log_file:
        log_server = LogServer(log_file)
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
