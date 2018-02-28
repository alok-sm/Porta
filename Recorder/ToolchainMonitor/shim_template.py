#!/usr/bin/python

import os
import sys
import json
from threading import Thread
from subprocess import Popen, PIPE
import time

import subprocess
import urllib2  

stdin_lines = []
stdout_lines = []
stderr_lines = []

original_bin = '%%original_binary%%'
file_extensions = '%%file_extensions%%'

cli_args = sys.argv[:]
cli_args[0] = original_bin

def copy_file_contents(src, dst, buffer):
    for line in src:
        line_str = line
        buffer.append(line_str)
        dst.write(line_str)


def get_code_files():
    files = []
    for extension in file_extensions:
        files.extend(
            subprocess.check_output(
                ['find', '.', '-name', extension]
            ).decode('ascii').split('\n')[:-1]
        )

    return {file:open(file).read() for file in files}

process = Popen(cli_args, stdin=PIPE, stdout=PIPE, stderr=PIPE)

threads = [
    Thread(target=copy_file_contents, args=(sys.stdin     , process.stdin, stdin_lines  )),
    Thread(target=copy_file_contents, args=(process.stdout, sys.stdout   , stdout_lines )),
    Thread(target=copy_file_contents, args=(process.stderr, sys.stderr   , stderr_lines ))
]


for thread in threads:
    thread.start()

process.wait()
return_code = process.poll()
sys.stdin.close()

unix_timestamp = time.time()

time.sleep(1)

log_line = json.dumps({
    'pwd': os.getcwd(),
    '_eventType': 'toolchainEvent',
    'command': cli_args,
    'stdin': "".join(stdin_lines),
    'stdout': "".join(stdout_lines),
    'stderr': "".join(stderr_lines),
    'returnCode': return_code,
    'files': get_code_files(),
    'timestamp': unix_timestamp
})

req = urllib2.Request('http://localhost:8000/log')
req.add_header('Content-Type', 'application/json')

urllib2.urlopen(req, log_line)

os._exit(0)
