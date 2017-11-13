#!/usr/bin/env python3

import os

from Commons import utils
from Commons.constants import logsDir
from ToolchainMonitor.shim_generator import generate_all_shims
from LoggingServer.server import LogServer
import sys
import atexit

# @atexit.register
def clean():
    utils.clean_bashrc()
    utils.clean_directories()
    # pass

def start():

    if len(sys.argv) < 3:
        print('no recording_name given')
        return

    utils.setup_directories()
    utils.setup_bashrc()
    generate_all_shims()
    utils.restart_bash()

    with open(os.path.join(logsDir, '{}.jsonlog'.format(sys.argv[1])), 'w') as log_file:
        log_server = LogServer(log_file)
        log_server.start()

def main():
    if len(sys.argv) < 2:
        print('start / clean?')
        return
    if sys.argv[1] == 'start':
        start()
    elif sys.argv[1] == 'clean':
        clean()


if __name__ == '__main__':
    main()