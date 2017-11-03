#!/usr/bin/python

import os
import sys
import json
from threading import Thread
from subprocess import Popen, PIPE
import time
from os.path import expanduser

stdin_lines = []
stdout_lines = []
stderr_lines = []

original_bin = '%%original_binary%%'
cli_args = sys.argv
cli_args[0] = original_bin

process = Popen(cli_args, stdin=PIPE, stdout=PIPE, stderr=PIPE)

def copy_file_contents(src, dst, buffer):
    for line in src:
        line_str = line
        buffer.append(line_str)
        dst.write(line_str)

threads = [
    Thread(target = copy_file_contents, args = (sys.stdin, process.stdin, stdin_lines)),
    Thread(target = copy_file_contents, args = (process.stdout, sys.stdout, stdout_lines)),
    Thread(target = copy_file_contents, args = (process.stderr, sys.stderr, stderr_lines))
]

for thread in threads:
    thread.start()

process.wait()
return_code = process.poll()
sys.stdin.close()

unix_timestamp = time.time()

log_filename = '{}.{}.log'.format(
    original_bin.lstrip('/').replace('/', '_'),
    str(unix_timestamp)
)

log_filepath = os.path.join(expanduser('~/.ngTorta/logs/stubs'), log_filename)

with open(log_filepath, 'w') as log_file:
    json.dump({
            'command': cli_args,
            'stdin': [line.strip() for line in stdin_lines],
            'stdout': [line.strip() for line in stdout_lines],
            'stderr': [line.strip() for line in stderr_lines],
            'return_code': return_code,
            'unix_timestamp': unix_timestamp
        }, log_file, sort_keys=True)

os._exit(0)